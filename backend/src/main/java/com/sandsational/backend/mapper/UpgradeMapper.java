package com.sandsational.backend.mapper;

import com.sandsational.backend.data.model.Upgrade;
import com.sandsational.backend.dto.response.UpgradeResponse;
import org.springframework.stereotype.Component;

@Component
public class UpgradeMapper {
    public UpgradeResponse toResponse(Upgrade upgrade){
        return new UpgradeResponse(
                upgrade.getId(),
                upgrade.getName(),
                upgrade.getDescription(),
                upgrade.getMaxLvl(),
                upgrade.getIconKey(),
                upgrade.getCode(),
                upgrade.getInitialPrice()
        );
    }
}
