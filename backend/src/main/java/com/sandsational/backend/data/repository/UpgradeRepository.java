package com.sandsational.backend.data.repository;

import com.sandsational.backend.data.model.Upgrade;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface UpgradeRepository  extends JpaRepository<Upgrade, UUID> {
    boolean existsByName(String name);
    boolean existsByCode(String code);
    Optional<Upgrade> findByCode(String code);
}
