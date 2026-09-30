package com.elms.leaverequest;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface LeaveRequestRepository extends JpaRepository<LeaveRequest, Long> {

    @Query("SELECT r FROM LeaveRequest r JOIN FETCH r.employee JOIN FETCH r.leaveType WHERE r.employee.id = :employeeId ORDER BY r.createdAt DESC")
    List<LeaveRequest> findByEmployeeId(@Param("employeeId") Long employeeId);

    @Query("SELECT r FROM LeaveRequest r JOIN FETCH r.employee JOIN FETCH r.leaveType WHERE r.status = :status ORDER BY r.createdAt ASC")
    List<LeaveRequest> findByStatus(@Param("status") LeaveStatus status);

    @Query("SELECT r FROM LeaveRequest r JOIN FETCH r.employee e JOIN FETCH r.leaveType WHERE e.manager.id = :managerId AND r.status = :status ORDER BY r.createdAt ASC")
    List<LeaveRequest> findByManagerIdAndStatus(@Param("managerId") Long managerId, @Param("status") LeaveStatus status);

    @Query("SELECT r FROM LeaveRequest r WHERE r.employee.id = :employeeId AND r.status IN :statuses AND r.startDate <= :endDate AND r.endDate >= :startDate")
    List<LeaveRequest> findOverlappingRequests(
            @Param("employeeId") Long employeeId,
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate,
            @Param("statuses") List<LeaveStatus> statuses
    );

    @Query("SELECT r FROM LeaveRequest r WHERE r.employee.id = :employeeId " +
           "AND r.leaveType.id = :leaveTypeId AND r.startDate = :startDate AND r.endDate = :endDate " +
           "AND r.status IN :statuses")
    List<LeaveRequest> findDuplicateRequests(
            @Param("employeeId") Long employeeId,
            @Param("leaveTypeId") Long leaveTypeId,
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate,
            @Param("statuses") List<LeaveStatus> statuses
    );

    @Query("SELECT COALESCE(SUM(r.requestedDays), 0) FROM LeaveRequest r " +
           "WHERE r.employee.id = :employeeId AND r.leaveType.id = :leaveTypeId " +
           "AND r.status = :status AND r.startDate >= :startOfYear AND r.startDate <= :endOfYear")
    Integer sumRequestedDaysByEmployeeAndTypeAndStatusAndYear(
            @Param("employeeId") Long employeeId,
            @Param("leaveTypeId") Long leaveTypeId,
            @Param("status") LeaveStatus status,
            @Param("startOfYear") LocalDate startOfYear,
            @Param("endOfYear") LocalDate endOfYear
    );

    @Query("SELECT r FROM LeaveRequest r JOIN FETCH r.employee JOIN FETCH r.leaveType " +
           "WHERE r.employee.id = :employeeId " +
           "AND (:status IS NULL OR r.status = :status) " +
           "AND (:startDate IS NULL OR r.endDate >= :startDate) " +
           "AND (:endDate IS NULL OR r.startDate <= :endDate) " +
           "ORDER BY r.createdAt DESC")
    List<LeaveRequest> findByEmployeeIdWithFilters(
            @Param("employeeId") Long employeeId,
            @Param("status") LeaveStatus status,
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate
    );

    @Query("SELECT r FROM LeaveRequest r JOIN FETCH r.employee e JOIN FETCH r.leaveType " +
           "WHERE e.manager.id = :managerId " +
           "AND (:status IS NULL OR r.status = :status) " +
           "AND (:startDate IS NULL OR r.endDate >= :startDate) " +
           "AND (:endDate IS NULL OR r.startDate <= :endDate) " +
           "ORDER BY r.createdAt DESC")
    List<LeaveRequest> findByManagerIdWithFilters(
            @Param("managerId") Long managerId,
            @Param("status") LeaveStatus status,
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate
    );

    @Query("SELECT r FROM LeaveRequest r JOIN FETCH r.employee e JOIN FETCH r.leaveType " +
           "WHERE (:status IS NULL OR r.status = :status) " +
           "AND (:startDate IS NULL OR r.endDate >= :startDate) " +
           "AND (:endDate IS NULL OR r.startDate <= :endDate) " +
           "ORDER BY r.createdAt DESC")
    List<LeaveRequest> findAllWithFilters(
            @Param("status") LeaveStatus status,
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate
    );

    @Query("SELECT r FROM LeaveRequest r JOIN FETCH r.employee e JOIN FETCH r.leaveType " +
           "WHERE e.manager.id = :managerId AND r.status = 'APPROVED' " +
           "AND r.startDate <= :date AND r.endDate >= :date")
    List<LeaveRequest> findTeamLeavesOnDate(
            @Param("managerId") Long managerId,
            @Param("date") LocalDate date
    );

    @Query("SELECT r FROM LeaveRequest r JOIN FETCH r.employee e JOIN FETCH r.leaveType " +
           "WHERE r.status = 'APPROVED' " +
           "AND r.startDate <= :date AND r.endDate >= :date")
    List<LeaveRequest> findAllLeavesOnDate(@Param("date") LocalDate date);

    @Query("SELECT r FROM LeaveRequest r JOIN FETCH r.employee e JOIN FETCH r.leaveType " +
           "WHERE e.manager.id = :managerId AND r.status = 'APPROVED' " +
           "AND r.startDate >= :date ORDER BY r.startDate ASC")
    List<LeaveRequest> findUpcomingTeamLeaves(
            @Param("managerId") Long managerId,
            @Param("date") LocalDate date
    );

    @Query("SELECT r FROM LeaveRequest r JOIN FETCH r.employee e JOIN FETCH r.leaveType " +
           "WHERE r.status = 'APPROVED' " +
           "AND r.startDate >= :date ORDER BY r.startDate ASC")
    List<LeaveRequest> findAllUpcomingLeaves(@Param("date") LocalDate date);

    @Query("SELECT r FROM LeaveRequest r JOIN FETCH r.employee e JOIN FETCH r.leaveType " +
           "WHERE (e.manager.id = :managerId OR r.approvedBy.id = :managerId) " +
           "AND r.status IN ('APPROVED', 'REJECTED') ORDER BY r.updatedAt DESC")
    List<LeaveRequest> findRecentDecisionsByManager(@Param("managerId") Long managerId);

    @Query("SELECT r FROM LeaveRequest r JOIN FETCH r.employee e JOIN FETCH r.leaveType " +
           "WHERE r.status IN ('APPROVED', 'REJECTED') ORDER BY r.updatedAt DESC")
    List<LeaveRequest> findAllRecentDecisions();

    long countByStatus(LeaveStatus status);

    @Query("SELECT COUNT(r) FROM LeaveRequest r WHERE r.employee.manager.id = :managerId AND r.status = :status")
    long countByEmployeeManagerIdAndStatus(@Param("managerId") Long managerId, @Param("status") LeaveStatus status);

    @Query("SELECT r FROM LeaveRequest r " +
           "JOIN FETCH r.employee e " +
           "LEFT JOIN FETCH e.department d " +
           "JOIN FETCH r.leaveType lt " +
           "WHERE (:managerId IS NULL OR e.manager.id = :managerId) " +
           "AND (:departmentId IS NULL OR d.id = :departmentId) " +
           "AND (:leaveTypeId IS NULL OR lt.id = :leaveTypeId) " +
           "AND (:status IS NULL OR r.status = :status) " +
           "AND (:startDate IS NULL OR r.endDate >= :startDate) " +
           "AND (:endDate IS NULL OR r.startDate <= :endDate) " +
           "ORDER BY r.startDate DESC")
    List<LeaveRequest> findRequestsForReport(
            @Param("managerId") Long managerId,
            @Param("departmentId") Long departmentId,
            @Param("leaveTypeId") Long leaveTypeId,
            @Param("status") LeaveStatus status,
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate
    );
}
