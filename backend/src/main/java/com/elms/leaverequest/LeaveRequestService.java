package com.elms.leaverequest;

import com.elms.exception.AccessDeniedException;
import com.elms.exception.BadRequestException;
import com.elms.exception.ConflictException;
import com.elms.exception.ResourceNotFoundException;
import com.elms.exception.UnauthorizedException;
import com.elms.leavebalance.LeaveBalance;
import com.elms.leavebalance.LeaveBalanceRepository;
import com.elms.leavebalance.dto.LeaveBalanceResponse;
import com.elms.leaverequest.dto.ApproveLeaveRequest;
import com.elms.leaverequest.dto.LeaveApplicationRequest;
import com.elms.leaverequest.dto.LeaveRequestResponse;
import com.elms.leaverequest.dto.ManagerLeaveDetailsResponse;
import com.elms.leaverequest.dto.RejectLeaveRequest;
import com.elms.leaverequest.dto.TeamDashboardStatsResponse;
import com.elms.leavetype.LeaveType;
import com.elms.leavetype.LeaveTypeRepository;
import com.elms.user.Role;
import com.elms.user.User;
import com.elms.user.UserRepository;
import com.elms.user.dto.UserResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Service
@SuppressWarnings("null")
public class LeaveRequestService {

    private static final Logger log = LoggerFactory.getLogger(LeaveRequestService.class);

    private final LeaveRequestRepository leaveRequestRepository;
    private final UserRepository userRepository;
    private final LeaveTypeRepository leaveTypeRepository;
    private final LeaveBalanceRepository leaveBalanceRepository;

    public LeaveRequestService(
            LeaveRequestRepository leaveRequestRepository,
            UserRepository userRepository,
            LeaveTypeRepository leaveTypeRepository,
            LeaveBalanceRepository leaveBalanceRepository
    ) {
        this.leaveRequestRepository = leaveRequestRepository;
        this.userRepository = userRepository;
        this.leaveTypeRepository = leaveTypeRepository;
        this.leaveBalanceRepository = leaveBalanceRepository;
    }

    @Transactional
    public LeaveRequestResponse createLeaveRequest(String userEmail, LeaveApplicationRequest request) {
        User employee = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new UnauthorizedException("Authenticated user record not found"));

        if (!employee.isActive()) {
            throw new BadRequestException("Inactive employee accounts cannot submit leave applications");
        }

        if (request.getStartDate() == null || request.getEndDate() == null) {
            throw new BadRequestException("Start date and end date are required");
        }

        if (request.getStartDate().isAfter(request.getEndDate())) {
            throw new BadRequestException("Start date cannot be after end date");
        }

        int requestedDays = (int) ChronoUnit.DAYS.between(request.getStartDate(), request.getEndDate()) + 1;
        if (requestedDays <= 0) {
            throw new BadRequestException("Requested duration must be at least 1 day");
        }

        LeaveType leaveType = leaveTypeRepository.findById(request.getLeaveTypeId())
                .orElseThrow(() -> new ResourceNotFoundException("LeaveType", "id", request.getLeaveTypeId()));

        if (!leaveType.isActive()) {
            throw new BadRequestException("Selected leave type is inactive and not available for new applications");
        }

        if (leaveType.isRequiresAttachment()) {
            if (request.getAttachmentName() == null || request.getAttachmentName().trim().isEmpty()) {
                throw new BadRequestException("An attachment is required for " + leaveType.getName() + " requests");
            }
        }

        if (request.getReason() == null || request.getReason().trim().length() < 5) {
            throw new BadRequestException("Reason must be at least 5 characters long");
        }

        // 1. Safe Duplicate Check (same user, same leave type, exact same date range)
        List<LeaveRequest> duplicates = leaveRequestRepository.findDuplicateRequests(
                employee.getId(),
                leaveType.getId(),
                request.getStartDate(),
                request.getEndDate(),
                List.of(LeaveStatus.PENDING, LeaveStatus.APPROVED)
        );
        if (!duplicates.isEmpty()) {
            throw new ConflictException("A duplicate leave request for these exact dates already exists with status: "
                    + duplicates.get(0).getStatus());
        }

        // 2. Overlap Check
        List<LeaveRequest> overlaps = leaveRequestRepository.findOverlappingRequests(
                employee.getId(),
                request.getStartDate(),
                request.getEndDate(),
                List.of(LeaveStatus.PENDING, LeaveStatus.APPROVED)
        );
        if (!overlaps.isEmpty()) {
            LeaveRequest existing = overlaps.get(0);
            throw new ConflictException("Your leave dates overlap with an existing " + existing.getStatus()
                    + " request from " + existing.getStartDate() + " to " + existing.getEndDate());
        }

        // 3. Quota & Balance Check: Remaining = Allocated - Used - Reserved/Pending
        int year = request.getStartDate().getYear();
        LocalDate startOfYear = LocalDate.of(year, 1, 1);
        LocalDate endOfYear = LocalDate.of(year, 12, 31);

        LeaveBalance balance = leaveBalanceRepository.findByEmployeeIdAndLeaveTypeIdAndYear(
                employee.getId(),
                leaveType.getId(),
                year
        ).orElseGet(() -> {
            LeaveBalance newBal = new LeaveBalance(employee, leaveType, leaveType.getAnnualAllocation(), year);
            return leaveBalanceRepository.save(newBal);
        });

        int pendingDays = leaveRequestRepository.sumRequestedDaysByEmployeeAndTypeAndStatusAndYear(
                employee.getId(),
                leaveType.getId(),
                LeaveStatus.PENDING,
                startOfYear,
                endOfYear
        );

        int availableDays = balance.getAllocatedDays() - balance.getUsedDays() - pendingDays;
        if (availableDays <= 0) {
            throw new BadRequestException("You have zero remaining balance for " + leaveType.getName() + " in " + year);
        }
        if (requestedDays > availableDays) {
            throw new BadRequestException("Insufficient leave balance. Requested: " + requestedDays
                    + " days, Available (after reserved pending): " + availableDays + " days");
        }

        // Create the PENDING request
        LeaveRequest leaveRequest = new LeaveRequest(
                employee,
                leaveType,
                request.getStartDate(),
                request.getEndDate(),
                requestedDays,
                request.getReason().trim()
        );
        if (request.getAttachmentName() != null && !request.getAttachmentName().trim().isEmpty()) {
            leaveRequest.setAttachmentName(request.getAttachmentName().trim());
        }
        leaveRequest.setStatus(LeaveStatus.PENDING);

        LeaveRequest saved = leaveRequestRepository.save(leaveRequest);

        log.info("Leave request created successfully: id={}, employeeId={}, type={}, days={}, status={}",
                saved.getId(), employee.getId(), leaveType.getName(), requestedDays, saved.getStatus());

        return LeaveRequestResponse.fromEntity(saved);
    }

    @Transactional(readOnly = true)
    public List<LeaveRequestResponse> getMyLeaveRequests(String userEmail, LeaveStatus status, LocalDate startDate, LocalDate endDate) {
        User user = userRepository.findByEmail(userEmail).orElse(null);
        if (user == null) {
            return Collections.emptyList();
        }

        return leaveRequestRepository.findByEmployeeIdWithFilters(user.getId(), status, startDate, endDate)
                .stream()
                .map(LeaveRequestResponse::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public LeaveRequestResponse getLeaveRequestById(Long id, String userEmail) {
        LeaveRequest request = leaveRequestRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("LeaveRequest", "id", id));

        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new UnauthorizedException("User not found"));

        boolean isOwner = request.getEmployee().getId().equals(user.getId());
        boolean isManagerOrAdmin = user.getRole() == Role.ADMIN || user.getRole() == Role.MANAGER;

        if (!isOwner && !isManagerOrAdmin) {
            throw new AccessDeniedException("You are not authorized to view this leave request");
        }

        return LeaveRequestResponse.fromEntity(request);
    }

    @Transactional
    public LeaveRequestResponse cancelLeaveRequest(Long id, String userEmail) {
        LeaveRequest request = leaveRequestRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("LeaveRequest", "id", id));

        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new UnauthorizedException("User not found"));

        boolean isOwner = request.getEmployee().getId().equals(user.getId());
        boolean isAdmin = user.getRole() == Role.ADMIN;

        if (!isOwner && !isAdmin) {
            throw new AccessDeniedException("Only the owner of an eligible leave request or an admin may cancel it");
        }

        if (request.getStatus() != LeaveStatus.PENDING) {
            throw new BadRequestException("Only PENDING leave requests can be cancelled. Current status is " + request.getStatus());
        }

        request.setStatus(LeaveStatus.CANCELLED);
        LeaveRequest saved = leaveRequestRepository.save(request);

        log.info("Leave request id={} cancelled by employeeId={}", saved.getId(), user.getId());

        return LeaveRequestResponse.fromEntity(saved);
    }

    @Transactional(readOnly = true)
    public List<LeaveRequestResponse> getPendingApprovalsForManager(String managerEmail) {
        User manager = userRepository.findByEmail(managerEmail).orElse(null);
        if (manager == null) {
            return Collections.emptyList();
        }
        if (manager.getRole() == Role.ADMIN) {
            return getAllPendingApprovals();
        }
        return leaveRequestRepository.findByManagerIdAndStatus(manager.getId(), LeaveStatus.PENDING)
                .stream()
                .map(LeaveRequestResponse::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<LeaveRequestResponse> getAllPendingApprovals() {
        return leaveRequestRepository.findByStatus(LeaveStatus.PENDING)
                .stream()
                .map(LeaveRequestResponse::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional
    public LeaveRequestResponse approveLeaveRequest(Long id, String managerEmail, ApproveLeaveRequest requestDto) {
        LeaveRequest leaveRequest = leaveRequestRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("LeaveRequest", "id", id));

        User manager = userRepository.findByEmail(managerEmail)
                .orElseThrow(() -> new UnauthorizedException("Authenticated user not found"));

        boolean isAdmin = manager.getRole() == Role.ADMIN;
        boolean isDirectManager = leaveRequest.getEmployee().getManager() != null
                && leaveRequest.getEmployee().getManager().getId().equals(manager.getId());

        if (!isAdmin && !isDirectManager) {
            throw new AccessDeniedException("You are not authorized to approve leave requests for this employee");
        }

        if (leaveRequest.getStatus() != LeaveStatus.PENDING) {
            throw new ConflictException("Leave request is no longer PENDING (current status: " + leaveRequest.getStatus() + ")");
        }

        int year = leaveRequest.getStartDate().getYear();
        LeaveBalance balance = leaveBalanceRepository.findByEmployeeIdAndLeaveTypeIdAndYear(
                leaveRequest.getEmployee().getId(),
                leaveRequest.getLeaveType().getId(),
                year
        ).orElseGet(() -> {
            LeaveBalance newBal = new LeaveBalance(
                    leaveRequest.getEmployee(),
                    leaveRequest.getLeaveType(),
                    leaveRequest.getLeaveType().getAnnualAllocation(),
                    year
            );
            return leaveBalanceRepository.save(newBal);
        });

        int newUsedDays = balance.getUsedDays() + leaveRequest.getRequestedDays();
        if (newUsedDays > balance.getAllocatedDays()) {
            throw new BadRequestException("Cannot approve: Requested days (" + leaveRequest.getRequestedDays()
                    + ") exceed remaining balance (" + (balance.getAllocatedDays() - balance.getUsedDays()) + ")");
        }

        balance.setUsedDays(newUsedDays);
        balance.setRemainingDays(balance.getAllocatedDays() - newUsedDays);
        leaveBalanceRepository.save(balance);

        leaveRequest.setStatus(LeaveStatus.APPROVED);
        leaveRequest.setApprovedBy(manager);
        leaveRequest.setApprovedAt(Instant.now());
        if (requestDto != null && requestDto.getComment() != null && !requestDto.getComment().trim().isEmpty()) {
            leaveRequest.setManagerComment(requestDto.getComment().trim());
        }

        LeaveRequest saved = leaveRequestRepository.save(leaveRequest);
        log.info("Leave request id={} APPROVED by manager/admin id={}", saved.getId(), manager.getId());
        return LeaveRequestResponse.fromEntity(saved);
    }

    @Transactional
    public LeaveRequestResponse rejectLeaveRequest(Long id, String managerEmail, RejectLeaveRequest requestDto) {
        LeaveRequest leaveRequest = leaveRequestRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("LeaveRequest", "id", id));

        User manager = userRepository.findByEmail(managerEmail)
                .orElseThrow(() -> new UnauthorizedException("Authenticated user not found"));

        boolean isAdmin = manager.getRole() == Role.ADMIN;
        boolean isDirectManager = leaveRequest.getEmployee().getManager() != null
                && leaveRequest.getEmployee().getManager().getId().equals(manager.getId());

        if (!isAdmin && !isDirectManager) {
            throw new AccessDeniedException("You are not authorized to reject leave requests for this employee");
        }

        if (leaveRequest.getStatus() != LeaveStatus.PENDING) {
            throw new ConflictException("Leave request is no longer PENDING (current status: " + leaveRequest.getStatus() + ")");
        }

        if (requestDto == null || requestDto.getComment() == null || requestDto.getComment().trim().isEmpty()) {
            throw new BadRequestException("Manager comment is required when rejecting a leave request");
        }

        leaveRequest.setStatus(LeaveStatus.REJECTED);
        leaveRequest.setApprovedBy(manager);
        leaveRequest.setApprovedAt(Instant.now());
        leaveRequest.setManagerComment(requestDto.getComment().trim());

        LeaveRequest saved = leaveRequestRepository.save(leaveRequest);
        log.info("Leave request id={} REJECTED by manager/admin id={}", saved.getId(), manager.getId());
        return LeaveRequestResponse.fromEntity(saved);
    }

    @Transactional(readOnly = true)
    public ManagerLeaveDetailsResponse getManagerLeaveDetails(Long id, String managerEmail) {
        LeaveRequest leaveRequest = leaveRequestRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("LeaveRequest", "id", id));

        User manager = userRepository.findByEmail(managerEmail)
                .orElseThrow(() -> new UnauthorizedException("Authenticated user not found"));

        boolean isAdmin = manager.getRole() == Role.ADMIN;
        boolean isDirectManager = leaveRequest.getEmployee().getManager() != null
                && leaveRequest.getEmployee().getManager().getId().equals(manager.getId());

        if (!isAdmin && !isDirectManager) {
            throw new AccessDeniedException("You are not authorized to view review details for this employee");
        }

        int year = leaveRequest.getStartDate().getYear();
        LocalDate startOfYear = LocalDate.of(year, 1, 1);
        LocalDate endOfYear = LocalDate.of(year, 12, 31);

        LeaveBalance balance = leaveBalanceRepository.findByEmployeeIdAndLeaveTypeIdAndYear(
                leaveRequest.getEmployee().getId(),
                leaveRequest.getLeaveType().getId(),
                year
        ).orElseGet(() -> new LeaveBalance(
                leaveRequest.getEmployee(),
                leaveRequest.getLeaveType(),
                leaveRequest.getLeaveType().getAnnualAllocation(),
                year
        ));

        int pendingDays = leaveRequestRepository.sumRequestedDaysByEmployeeAndTypeAndStatusAndYear(
                leaveRequest.getEmployee().getId(),
                leaveRequest.getLeaveType().getId(),
                LeaveStatus.PENDING,
                startOfYear,
                endOfYear
        );

        LeaveBalanceResponse balanceResponse = new LeaveBalanceResponse(
                balance.getId(),
                leaveRequest.getEmployee().getId(),
                leaveRequest.getEmployee().getName(),
                leaveRequest.getLeaveType().getId(),
                leaveRequest.getLeaveType().getName(),
                balance.getAllocatedDays(),
                balance.getUsedDays(),
                pendingDays,
                balance.getAllocatedDays() - balance.getUsedDays() - pendingDays,
                year
        );

        List<LeaveRequestResponse> history = leaveRequestRepository.findByEmployeeIdWithFilters(
                leaveRequest.getEmployee().getId(), null, null, null)
                .stream()
                .filter(req -> !req.getId().equals(leaveRequest.getId()))
                .map(LeaveRequestResponse::fromEntity)
                .collect(Collectors.toList());

        return new ManagerLeaveDetailsResponse(
                LeaveRequestResponse.fromEntity(leaveRequest),
                balanceResponse,
                history
        );
    }

    @Transactional(readOnly = true)
    public List<LeaveRequestResponse> getTeamLeaves(String managerEmail, LeaveStatus status, LocalDate startDate, LocalDate endDate) {
        User manager = userRepository.findByEmail(managerEmail)
                .orElseThrow(() -> new UnauthorizedException("Authenticated user not found"));

        List<LeaveRequest> list;
        if (manager.getRole() == Role.ADMIN) {
            list = leaveRequestRepository.findAllWithFilters(status, startDate, endDate);
        } else {
            list = leaveRequestRepository.findByManagerIdWithFilters(manager.getId(), status, startDate, endDate);
        }

        return list.stream()
                .map(LeaveRequestResponse::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public TeamDashboardStatsResponse getTeamDashboardStats(String managerEmail) {
        User manager = userRepository.findByEmail(managerEmail)
                .orElseThrow(() -> new UnauthorizedException("Authenticated user not found"));

        LocalDate today = LocalDate.now();
        LocalDate tomorrow = today.plusDays(1);

        int pendingCount;
        List<UserResponse> teamMembers;
        List<LeaveRequestResponse> currentlyOnLeave;
        List<LeaveRequestResponse> upcomingLeave;
        List<LeaveRequestResponse> recentDecisions;

        if (manager.getRole() == Role.ADMIN) {
            pendingCount = leaveRequestRepository.findByStatus(LeaveStatus.PENDING).size();
            teamMembers = userRepository.findAll().stream()
                    .map(UserResponse::fromUser)
                    .collect(Collectors.toList());
            currentlyOnLeave = leaveRequestRepository.findAllLeavesOnDate(today).stream()
                    .map(LeaveRequestResponse::fromEntity)
                    .collect(Collectors.toList());
            upcomingLeave = leaveRequestRepository.findAllUpcomingLeaves(tomorrow).stream()
                    .map(LeaveRequestResponse::fromEntity)
                    .collect(Collectors.toList());
            recentDecisions = leaveRequestRepository.findAllRecentDecisions().stream()
                    .map(LeaveRequestResponse::fromEntity)
                    .collect(Collectors.toList());
        } else {
            pendingCount = leaveRequestRepository.findByManagerIdAndStatus(manager.getId(), LeaveStatus.PENDING).size();
            teamMembers = userRepository.findByManagerId(manager.getId()).stream()
                    .map(UserResponse::fromUser)
                    .collect(Collectors.toList());
            currentlyOnLeave = leaveRequestRepository.findTeamLeavesOnDate(manager.getId(), today).stream()
                    .map(LeaveRequestResponse::fromEntity)
                    .collect(Collectors.toList());
            upcomingLeave = leaveRequestRepository.findUpcomingTeamLeaves(manager.getId(), tomorrow).stream()
                    .map(LeaveRequestResponse::fromEntity)
                    .collect(Collectors.toList());
            recentDecisions = leaveRequestRepository.findRecentDecisionsByManager(manager.getId()).stream()
                    .map(LeaveRequestResponse::fromEntity)
                    .collect(Collectors.toList());
        }

        return new TeamDashboardStatsResponse(
                pendingCount,
                teamMembers.size(),
                teamMembers,
                currentlyOnLeave,
                upcomingLeave,
                recentDecisions
        );
    }
}
