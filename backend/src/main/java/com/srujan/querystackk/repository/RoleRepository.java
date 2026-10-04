package com.srujan.querystackk.repository;


import com.srujan.querystackk.entity.Role;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface RoleRepository extends JpaRepository<Role, Long> {
    Optional<Role> findByName(Role.RoleName name);
    Boolean existsByName(Role.RoleName name);
}