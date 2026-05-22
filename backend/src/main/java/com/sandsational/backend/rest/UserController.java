package com.sandsational.backend.rest;

import com.sandsational.backend.dto.request.CreateUserRequest;
import com.sandsational.backend.dto.response.UserResponse;
import com.sandsational.backend.facade.UserFacade;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@Tag(name="Users", description = "User management")
@RestController
@RequestMapping(value = "/api/users", produces = MediaType.APPLICATION_JSON_VALUE)
public class UserController {
    private final UserFacade userFacade;

    @Autowired
    public UserController(UserFacade userFacade){
        this.userFacade = userFacade;
    }

    @PostMapping(consumes = MediaType.APPLICATION_JSON_VALUE)
    @ResponseStatus(HttpStatus.CREATED)
    @Operation(
            summary = "Create a new user",
            responses = {
                    @ApiResponse(responseCode = "201", description = "User created"),
                    @ApiResponse(responseCode = "400", description = "Invalid request"),
                    @ApiResponse(responseCode = "409", description = "Email or username already exists")
            }
    )
    public UserResponse createUser(@Valid @RequestBody CreateUserRequest request){
        return userFacade.createUser(request);
    }

    @GetMapping
    @Operation(
            summary = "List all users",
            responses = {
                    @ApiResponse(responseCode = "200", description = "Users listed")
            }
    )
    public List<UserResponse> getUsers(){
        return userFacade.getUsers();
    }

    @GetMapping("/{id}")
    @Operation(
            summary = "Get user by ID",
            responses = {
                    @ApiResponse(responseCode = "200", description = "User found"),
                    @ApiResponse(responseCode = "404", description = "User not found")
            }
    )
    public UserResponse getUser(@PathVariable UUID id){
        return userFacade.getUser(id);
    }
}
