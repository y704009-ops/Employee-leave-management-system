package com.elms.user;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    boolean existsByEmail(String email);

    @Query("SELECT u FROM User u WHERE u.department.id = :departmentId")
    List<User> findByDepartmentId(@Param("departmentId") Long departmentId);

    @Query("SELECT u FROM User u WHERE u.manager.id = :managerId ORDER BY u.name ASC")
    List<User> findByManagerId(@Param("managerId") Long managerId);

    long countByActiveTrue();

    @Query("SELECT COUNT(u) FROM User u WHERE u.manager.id = :managerId AND u.active = true")
    long countByManagerIdAndActiveTrue(@Param("managerId") Long managerId);
}
