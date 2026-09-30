package com.elms.leavetype;

import com.elms.exception.BadRequestException;
import com.elms.exception.ResourceNotFoundException;
import com.elms.leavetype.dto.LeaveTypeRequest;
import com.elms.leavetype.dto.LeaveTypeResponse;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@SuppressWarnings("null")
public class LeaveTypeService {

    private final LeaveTypeRepository leaveTypeRepository;

    public LeaveTypeService(LeaveTypeRepository leaveTypeRepository) {
        this.leaveTypeRepository = leaveTypeRepository;
    }

    @Transactional(readOnly = true)
    public List<LeaveTypeResponse> getAllLeaveTypes() {
        return leaveTypeRepository.findAll()
                .stream()
                .map(LeaveTypeResponse::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<LeaveTypeResponse> getActiveLeaveTypes() {
        return leaveTypeRepository.findByActiveTrue()
                .stream()
                .map(LeaveTypeResponse::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public LeaveTypeResponse getLeaveTypeById(Long id) {
        LeaveType leaveType = leaveTypeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("LeaveType not found with id: " + id));
        return LeaveTypeResponse.fromEntity(leaveType);
    }

    @Transactional
    public LeaveTypeResponse createLeaveType(LeaveTypeRequest request) {
        if (leaveTypeRepository.existsByName(request.getName())) {
            throw new BadRequestException("LeaveType with name '" + request.getName() + "' already exists");
        }

        LeaveType leaveType = new LeaveType(
                request.getName(),
                request.getDescription(),
                request.getAnnualAllocation(),
                request.isRequiresAttachment()
        );
        leaveType.setActive(request.isActive());

        LeaveType saved = leaveTypeRepository.save(leaveType);
        return LeaveTypeResponse.fromEntity(saved);
    }

    @Transactional
    public LeaveTypeResponse updateLeaveType(Long id, LeaveTypeRequest request) {
        LeaveType leaveType = leaveTypeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("LeaveType not found with id: " + id));

        if (!leaveType.getName().equalsIgnoreCase(request.getName()) && leaveTypeRepository.existsByName(request.getName())) {
            throw new BadRequestException("LeaveType with name '" + request.getName() + "' already exists");
        }

        leaveType.setName(request.getName());
        leaveType.setDescription(request.getDescription());
        leaveType.setAnnualAllocation(request.getAnnualAllocation());
        leaveType.setRequiresAttachment(request.isRequiresAttachment());
        leaveType.setActive(request.isActive());

        LeaveType updated = leaveTypeRepository.save(leaveType);
        return LeaveTypeResponse.fromEntity(updated);
    }

    @Transactional
    public LeaveTypeResponse updateStatus(Long id, boolean active) {
        LeaveType leaveType = leaveTypeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("LeaveType not found with id: " + id));

        leaveType.setActive(active);
        LeaveType updated = leaveTypeRepository.save(leaveType);
        return LeaveTypeResponse.fromEntity(updated);
    }
}
