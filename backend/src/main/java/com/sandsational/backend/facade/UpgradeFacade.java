package com.sandsational.backend.facade;

import com.sandsational.backend.dto.request.CreateUpgradeRequest;
import com.sandsational.backend.dto.response.UpgradeResponse;
import com.sandsational.backend.mapper.UpgradeMapper;
import com.sandsational.backend.service.UpgradeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class UpgradeFacade {
    private final UpgradeService upgradeService;
    private final UpgradeMapper upgradeMapper;

    @Autowired
    public UpgradeFacade(UpgradeService upgradeService, UpgradeMapper upgradeMapper){
        this.upgradeService = upgradeService;
        this.upgradeMapper = upgradeMapper;
    }

    public UpgradeResponse createUpgrade(CreateUpgradeRequest request){
        return upgradeMapper.toResponse(upgradeService.createUpgrade(
                request.maxLvl(), request.name(), request.description(), request.iconKey(), request.code(), request.initialPrice()
        ));
    }

    @Transactional(readOnly = true)
    public List<UpgradeResponse> findAll(){
        return upgradeService.findAll()
                .stream()
                .map(upgradeMapper::toResponse)
                .toList();
    }
}
