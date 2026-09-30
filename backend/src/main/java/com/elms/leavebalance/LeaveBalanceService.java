package com.elms.leavebalance;

import com.elms.exception.BadRequestException;
import com.elms.exception.ResourceNotFoundException;
import com.elms.leavebalance.dto.AdjustBalanceRequest;
import com.elms.leavebalance.dto.LeaveBalanceResponse;
import com.elms.leaverequest.LeaveRequestRepository;
import com.elms.leaverequest.LeaveStatus;
import com.elms.leavetype.LeaveType;
import com.elms.leavetype.LeaveTypeRepository;
import com.elms.user.User;
import com.elms.user.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@SuppressWarnings("null")
public class LeaveBalanceService {

    private static final Logger log = LoggerFactory.getLogger(LeaveBalanceService.class);

    private final LeaveBalanceRepository leaveBalanceRepository;
    private final LeaveRequestRepository leaveRequestRepository;
    private final LeaveTypeRepository leaveTypeRepository;
    private final UserRepository userRepository;

    public LeaveBalanceService(
            LeaveBalanceRepository leaveBalanceRepository,
            LeaveRequestRepository leaveRequestRepository,
            LeaveTypeRepository leaveTypeRepository,
            UserRepository userRepository
    ) {
        this.leaveBalanceRepository = leaveBalanceRepository;
        this.leaveRequestRepository = leaveRequestRepository;
        this.leaveTypeRepository = leaveTypeRepository;
        this.userRepository = userRepository;
    }

    @Transactional(readOnly = true)
    public List<LeaveBalanceResponse> getAllBalances(Integer year) {
        List<LeaveBalance> balances = (year != null)
                ? leaveBalanceRepository.findAllByYearWithDetails(year)
                : leaveBalanceRepository.findAllWithDetails();
        return balances.stream()
                .map(this::enrichWithPending)
                .collect(Collectors.toList());
    }

    @Transactional
    public List<LeaveBalanceResponse> getBalancesByEmployee(Long employeeId) {
        return getBalancesByEmployeeAndYear(employeeId, LocalDate.now().getYear());
    }

    @Transactional
    public List<LeaveBalanceResponse> getBalancesByEmployeeAndYear(Long employeeId, Integer year) {
        int targetYear = (year != null) ? year : LocalDate.now().getYear();
        User employee = userRepository.findById(employeeId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", employeeId));

        List<LeaveBalance> existing = new ArrayList<>(leaveBalanceRepository.findByEmployeeIdAndYear(employeeId, targetYear));
        Set<Long> existingTypeIds = existing.stream().map(b -> b.getLeaveType().getId()).collect(Collectors.toSet());

        List<LeaveType> activeTypes = leaveTypeRepository.findByActiveTrue();
        for (LeaveType lt : activeTypes) {
            if (!existingTypeIds.contains(lt.getId())) {
                LeaveBalance newBal = new LeaveBalance(employee, lt, lt.getAnnualAllocation(), targetYear);
                existing.add(leaveBalanceRepository.save(newBal));
            }
        }

        return existing.stream()
                .map(this::enrichWithPending)
                .collect(Collectors.toList());
    }

    @Transactional
    public LeaveBalanceResponse adjustBalance(Long balanceId, AdjustBalanceRequest request) {
        LeaveBalance balance = leaveBalanceRepository.findById(balanceId)
                .orElseThrow(() -> new ResourceNotFoundException("LeaveBalance", "id", balanceId));

        if (request.getAllocatedDays() < 0) {
            throw new BadRequestException("Allocated days cannot be negative");
        }
        if (request.getUsedDays() < 0) {
            throw new BadRequestException("Used days cannot be negative");
        }
        if (request.getUsedDays() > request.getAllocatedDays()) {
            throw new BadRequestException("Used days cannot exceed allocated days");
        }

        int prevAllocated = balance.getAllocatedDays();
        int prevUsed = balance.getUsedDays();

        balance.setAllocatedDays(request.getAllocatedDays());
        balance.setUsedDays(request.getUsedDays());
        balance.setRemainingDays(request.getAllocatedDays() - request.getUsedDays());

        LeaveBalance saved = leaveBalanceRepository.save(balance);

        log.info("Admin adjusted LeaveBalance id={} for employeeId={}: allocated [{} -> {}], used [{} -> {}], reason='{}'",
                balanceId, balance.getEmployee().getId(), prevAllocated, request.getAllocatedDays(),
                prevUsed, request.getUsedDays(), request.getReason());

        return enrichWithPending(saved);
    }

    public LeaveBalanceResponse enrichWithPending(LeaveBalance balance) {
        int year = balance.getYear();
        LocalDate startOfYear = LocalDate.of(year, 1, 1);
        LocalDate endOfYear = LocalDate.of(year, 12, 31);

        int pendingDays = leaveRequestRepository.sumRequestedDaysByEmployeeAndTypeAndStatusAndYear(
                balance.getEmployee().getId(),
                balance.getLeaveType().getId(),
                LeaveStatus.PENDING,
                startOfYear,
                endOfYear
        );

        LeaveBalanceResponse resp = LeaveBalanceResponse.fromEntity(balance);
        resp.setPendingDays(pendingDays);
        int remaining = Math.max(0, balance.getAllocatedDays() - balance.getUsedDays() - pendingDays);
        resp.setRemainingDays(remaining);
        return resp;
    }
}
