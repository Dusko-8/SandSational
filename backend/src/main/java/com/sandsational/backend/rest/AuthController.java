package com.sandsational.backend.rest;

import com.sandsational.backend.dto.request.LoginUserRequest;
import com.sandsational.backend.dto.response.LoginUserResponse;
import com.sandsational.backend.facade.AuthFacade;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


@RestController
@RequestMapping(value = "/api/auth", produces = MediaType.APPLICATION_JSON_VALUE)
public class AuthController {
    private final AuthFacade authFacade;

    @Autowired
    public AuthController(AuthFacade authFacade){
        this.authFacade = authFacade;
    }

    @PostMapping(value = "/login", consumes = MediaType.APPLICATION_JSON_VALUE)
    public LoginUserResponse login(@Valid @RequestBody LoginUserRequest request){
        return authFacade.login(request);
    }
}
