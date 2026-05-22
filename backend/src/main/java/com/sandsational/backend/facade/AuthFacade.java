package com.sandsational.backend.facade;

import com.sandsational.backend.dto.request.LoginUserRequest;
import com.sandsational.backend.dto.response.LoginUserResponse;
import com.sandsational.backend.service.AuthService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class AuthFacade {
    private final AuthService authService;

    public AuthFacade(AuthService authService) {
        this.authService = authService;
    }

    @Transactional(readOnly = true)
    public LoginUserResponse login(LoginUserRequest request) {
        return authService.login(request);
    }
}
