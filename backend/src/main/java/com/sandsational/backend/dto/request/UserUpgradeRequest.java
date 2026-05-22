package com.sandsational.backend.dto.request;

import jakarta.validation.constraints.NotNull;

import java.util.UUID;

public record UserUpgradeRequest(
        @NotNull
        UUID userId,

        @NotNull
        String upgradeCode
){
}
