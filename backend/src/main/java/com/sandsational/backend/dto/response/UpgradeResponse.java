package com.sandsational.backend.dto.response;

import java.util.UUID;

public record UpgradeResponse(
        UUID id,
        String name,
        String description,
        int maxLvl,
        String iconKey,
        String code,
        Long initialPrice
) {
}
