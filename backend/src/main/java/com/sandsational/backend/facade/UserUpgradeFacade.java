package com.sandsational.backend.facade;

import com.sandsational.backend.data.model.Upgrade;
import com.sandsational.backend.dto.request.UserUpgradeRequest;
import com.sandsational.backend.dto.response.UserUpgradeResponse;
import com.sandsational.backend.mapper.UserUpgradeMapper;
import com.sandsational.backend.service.UpgradeService;
import com.sandsational.backend.service.UserUpgradeService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@Transactional
public class UserUpgradeFacade {
    private final UserUpgradeService userUpgradeService;
    private final UserUpgradeMapper userUpgradeMapper;
    private final UpgradeService upgradeService;

    public UserUpgradeFacade(
            UserUpgradeService userUpgradeService,
            UserUpgradeMapper userUpgradeMapper,
            UpgradeService upgradeService
    ) {
        this.userUpgradeService = userUpgradeService;
        this.userUpgradeMapper = userUpgradeMapper;
        this.upgradeService = upgradeService;
    }

    @Transactional(readOnly = true)
    public List<UserUpgradeResponse> listUserUpgrades(UUID userId){
        return userUpgradeService.listUpgrades(userId)
                .stream()
                .map(userUpgradeMapper::toResponse)
                .toList();
    }

    public UserUpgradeResponse createUserUpgrade(UserUpgradeRequest request){
        Upgrade upgrade = upgradeService.getByCode(request.upgradeCode());

        return userUpgradeMapper.toResponse(
                userUpgradeService.createUserUpgrade(request.userId(), upgrade.getId())
        );
    }

    public UserUpgradeResponse incrementUserUpgrade(UserUpgradeRequest request){
        Upgrade upgrade = upgradeService.getByCode(request.upgradeCode());

        return userUpgradeMapper.toResponse(
                userUpgradeService.incrementUpgradeLevel(request.userId(), upgrade.getId())
        );
    }
}
