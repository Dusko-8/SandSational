package com.sandsational.backend.dto.response;

public record UserUpgradeResponse(
        UserResponse user,
        UpgradeResponse upgrade,
        int level
) {
}
