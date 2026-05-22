package com.sandsational.backend.service;

import com.sandsational.backend.data.model.Upgrade;
import com.sandsational.backend.data.model.User;
import com.sandsational.backend.data.model.UserUpgrade;
import com.sandsational.backend.data.repository.UpgradeRepository;
import com.sandsational.backend.data.repository.UserRepository;
import com.sandsational.backend.data.repository.UserUpgradeRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
public class UserUpgradeService {
    private final UserUpgradeRepository userUpgradeRepository;
    private final UserRepository userRepository;
    private final UpgradeRepository upgradeRepository;

    public UserUpgradeService(
            UserUpgradeRepository userUpgradeRepository,
            UserRepository userRepository,
            UpgradeRepository upgradeRepository
    ){
        this.userUpgradeRepository = userUpgradeRepository;
        this.userRepository = userRepository;
        this.upgradeRepository = upgradeRepository;
    }

    @Transactional(readOnly = true)
    public List<UserUpgrade> listUpgrades(UUID userId){
        return userUpgradeRepository.findByUser_Id(userId);
    }

    @Transactional
    public UserUpgrade createUserUpgrade(UUID userId, UUID upgradeId){
        if(userUpgradeRepository.existsByUser_IdAndUpgrade_Id(userId, upgradeId)){
            throw new IllegalArgumentException("User already has this upgrade");
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User does not exist"));

        Upgrade upgrade = upgradeRepository.findById(upgradeId)
                .orElseThrow(() -> new IllegalArgumentException("Upgrade does not exist"));

        UserUpgrade userUpgrade = new UserUpgrade(user, upgrade);

        return userUpgradeRepository.save(userUpgrade);
    }

    @Transactional
    public UserUpgrade incrementUpgradeLevel(UUID userId, UUID upgradeId) {
        UserUpgrade userUpgrade = userUpgradeRepository
                .findByUser_IdAndUpgrade_Id(userId, upgradeId)
                .orElseThrow(() -> new IllegalArgumentException("User does not have this upgrade"));

        Upgrade upgrade = userUpgrade.getUpgrade();

        if (userUpgrade.getLevel() >= upgrade.getMaxLvl()) {
            throw new IllegalArgumentException("Upgrade is already at max level");
        }

        userUpgrade.incrementLevel();

        return userUpgrade;
    }
}
