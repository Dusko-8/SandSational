package com.sandsational.backend.dto.response;

public record LoginUserResponse(
        String accessToken,
        String tokenType,
        long expiresInSeconds,
        UserResponse user
) {
}