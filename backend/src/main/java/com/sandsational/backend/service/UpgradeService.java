package com.sandsational.backend.service;

import com.sandsational.backend.data.model.Upgrade;
import com.sandsational.backend.data.repository.UpgradeRepository;
import com.sandsational.backend.exception.NotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class UpgradeService {
    private final UpgradeRepository upgradeRepository;

    @Autowired
    public UpgradeService(UpgradeRepository upgradeRepository){
        this.upgradeRepository = upgradeRepository;
    }

    @Transactional(readOnly = true)
    public List<Upgrade> findAll() { return upgradeRepository.findAll(); }

    @Transactional(readOnly = true)
    public Upgrade getByCode(String code){
        return upgradeRepository.findByCode(code)
                .orElseThrow(() -> new NotFoundException("Upgrade not found"));
    }

    @Transactional
    public Upgrade createUpgrade(
            int maxLvl,
            String name,
            String description,
            String icon_key,
            String code,
            Long initialPrice
    ){
        if(upgradeRepository.existsByName(name)) {
            throw new IllegalArgumentException("Upgrade name already used");
        }

        if(upgradeRepository.existsByCode(code)) {
            throw new IllegalArgumentException("Upgrade code already used");
        }

        Upgrade upgrade = new Upgrade(maxLvl, name, description, icon_key, code, initialPrice);
        return upgradeRepository.save(upgrade);
    }

    @Transactional
    public Upgrade upsertUpgrade(
            int maxLvl,
            String name,
            String description,
            String icon_key,
            String code,
            Long initialPrice
    ){
        Upgrade upgrade = upgradeRepository.findByCode(code)
                .orElseGet(Upgrade::new);

        upgrade.setName(name);
        upgrade.setDescription(description);
        upgrade.setIconKey(icon_key);
        upgrade.setMaxLvl(maxLvl);
        upgrade.setInitialPrice(initialPrice);

        return upgradeRepository.save(upgrade);
    }
}
