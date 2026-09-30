package com.elms.leavebalance;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface LeaveBalanceRepository extends JpaRepository<LeaveBalance, Long> {

    @Query("SELECT b FROM LeaveBalance b JOIN FETCH b.leaveType WHERE b.employee.id = :employeeId AND b.year = :year")
    List<LeaveBalance> findByEmployeeIdAndYear(@Param("employeeId") Long employeeId, @Param("year") Integer year);

    @Query("SELECT b FROM LeaveBalance b JOIN FETCH b.leaveType WHERE b.employee.id = :employeeId")
    List<LeaveBalance> findByEmployeeId(@Param("employeeId") Long employeeId);

    @Query("SELECT b FROM LeaveBalance b WHERE b.employee.id = :employeeId AND b.leaveType.id = :leaveTypeId AND b.year = :year")
    Optional<LeaveBalance> findByEmployeeIdAndLeaveTypeIdAndYear(
            @Param("employeeId") Long employeeId,
            @Param("leaveTypeId") Long leaveTypeId,
            @Param("year") Integer year
    );

    boolean existsByEmployeeIdAndLeaveTypeIdAndYear(Long employeeId, Long leaveTypeId, Integer year);

    @Query("SELECT b FROM LeaveBalance b JOIN FETCH b.employee JOIN FETCH b.leaveType WHERE b.year = :year ORDER BY b.employee.name ASC")
    List<LeaveBalance> findAllByYearWithDetails(@Param("year") Integer year);

    @Query("SELECT b FROM LeaveBalance b JOIN FETCH b.employee JOIN FETCH b.leaveType ORDER BY b.year DESC, b.employee.name ASC")
    List<LeaveBalance> findAllWithDetails();

    @Query("SELECT COALESCE(SUM(b.allocatedDays), 0) FROM LeaveBalance b " +
           "WHERE (:managerId IS NULL OR b.employee.manager.id = :managerId) " +
           "AND (:departmentId IS NULL OR b.employee.department.id = :departmentId) " +
           "AND (:leaveTypeId IS NULL OR b.leaveType.id = :leaveTypeId) " +
           "AND (:year IS NULL OR b.year = :year)")
    Long sumAllocatedDays(
            @Param("managerId") Long managerId,
            @Param("departmentId") Long departmentId,
            @Param("leaveTypeId") Long leaveTypeId,
            @Param("year") Integer year
    );

    @Query("SELECT COALESCE(SUM(b.usedDays), 0) FROM LeaveBalance b " +
           "WHERE (:managerId IS NULL OR b.employee.manager.id = :managerId) " +
           "AND (:departmentId IS NULL OR b.employee.department.id = :departmentId) " +
           "AND (:leaveTypeId IS NULL OR b.leaveType.id = :leaveTypeId) " +
           "AND (:year IS NULL OR b.year = :year)")
    Long sumUsedDays(
            @Param("managerId") Long managerId,
            @Param("departmentId") Long departmentId,
            @Param("leaveTypeId") Long leaveTypeId,
            @Param("year") Integer year
    );
}
