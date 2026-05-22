package com.sandsational.backend.data.repository;

import com.sandsational.backend.data.model.UserUpgrade;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface UserUpgradeRepository  extends JpaRepository<UserUpgrade, UUID> {
    @EntityGraph(attributePaths = {"upgrade"})
    List<UserUpgrade> findByUser_Id(UUID userId);

    @EntityGraph(attributePaths = {"upgrade"})
    Optional<UserUpgrade> findByUser_IdAndUpgrade_Id(UUID userId, UUID upgradeId);

    boolean existsByUser_IdAndUpgrade_Id(UUID userId, UUID upgradeId);
}
