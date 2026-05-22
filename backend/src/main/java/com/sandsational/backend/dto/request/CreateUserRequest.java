package com.sandsational.backend.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record CreateUserRequest(
        @NotNull
        @Size(max=254)
        @Email
        String email,

        @NotNull
        @Size(max=50)
        String username,

        @NotNull
        @Size(min=8, max=72)
        String password
){}