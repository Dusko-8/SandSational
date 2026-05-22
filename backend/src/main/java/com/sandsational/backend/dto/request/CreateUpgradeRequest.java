package com.sandsational.backend.dto.request;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record CreateUpgradeRequest(
        @NotNull
        @Size(max=50)
        String name,

        @NotNull
        @Size(max=254)
        String description,

        int maxLvl,

        @NotNull
        @Size(max=50)
        String iconKey,

        @NotNull
        @Size(max=50)
        String code,

        @NotNull
        Long initialPrice
) {
}
