package com.sandsational.backend.init;


import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.sandsational.backend.dto.request.CreateUpgradeRequest;
import com.sandsational.backend.service.UpgradeService;
import org.jspecify.annotations.NonNull;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.io.InputStream;
import java.util.List;

@Component
public class UpgradeDataInitializer implements ApplicationRunner {
    private final ObjectMapper objectMapper;
    private final UpgradeService upgradeService;

    @Autowired
    public UpgradeDataInitializer(ObjectMapper objectMapper, UpgradeService upgradeService) {
        this.objectMapper = objectMapper;
        this.upgradeService = upgradeService;
    }

    @Override
    @Transactional
    public void run(@NonNull ApplicationArguments args) throws Exception {
        ClassPathResource resource = new ClassPathResource("data/upgrades.json");

        try (InputStream inputStream = resource.getInputStream()) {
            List<CreateUpgradeRequest> upgrades = objectMapper.readValue(
                    inputStream,
                    new TypeReference<>() {}
            );

            for (CreateUpgradeRequest request : upgrades) {
                upgradeService.upsertUpgrade(
                        request.maxLvl(),
                        request.name(),
                        request.description(),
                        request.iconKey(),
                        request.code(),
                        request.initialPrice()
                );
            }
        }
    }
}
