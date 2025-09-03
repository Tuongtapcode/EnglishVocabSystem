package com.nnt.englishvocabsystem.repositories;

import com.nnt.englishvocabsystem.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.Instant;
import java.util.List;

@Repository
public interface UserRepository extends JpaRepository<User, Integer>, JpaSpecificationExecutor<User> {
    User findByUsername(String username);
    boolean existsByUsername(String username);
    boolean existsByEmail(String email);

    @Query("SELECT u.userType, COUNT(u) " +
            "FROM User u " +
            "GROUP BY u.userType")
    List<Object[]> countUsersByType();

    @Query("SELECT FUNCTION('DAYOFWEEK', u.lastLoginAt), COUNT(u) " +
            "FROM User u " +
            "WHERE u.lastLoginAt >= :startDate " +
            "GROUP BY FUNCTION('DAYOFWEEK', u.lastLoginAt) " +
            "ORDER BY FUNCTION('DAYOFWEEK', u.lastLoginAt)")
    List<Object[]> countActiveUsersByDay(@Param("startDate") Instant startDate);
}