package com.sandsational.backend.rest;

import com.sandsational.backend.dto.request.UserUpgradeRequest;
import com.sandsational.backend.dto.response.UserUpgradeResponse;
import com.sandsational.backend.facade.UserUpgradeFacade;
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

@Tag(name = "UserUpgrades", description = "User's upgrades management")
@RestController
@RequestMapping(value = "/api/user-upgrades")
public class UserUpgradeController {

    private final UserUpgradeFacade userUpgradeFacade;

    @Autowired
    public UserUpgradeController(UserUpgradeFacade userUpgradeFacade) {
        this.userUpgradeFacade = userUpgradeFacade;
    }

    @PostMapping(consumes = MediaType.APPLICATION_JSON_VALUE)
    @ResponseStatus(HttpStatus.CREATED)
    @Operation(
            summary = "Create a user upgrade",
            responses = {
                    @ApiResponse(responseCode = "201", description = "User upgrade created"),
                    @ApiResponse(responseCode = "400", description = "Invalid request")
            }
    )
    public UserUpgradeResponse createUserUpgrade(@Valid @RequestBody UserUpgradeRequest request) {
        return userUpgradeFacade.createUserUpgrade(request);
    }

    @PostMapping(value = "/increment", consumes = MediaType.APPLICATION_JSON_VALUE)
    @Operation(
            summary = "Increment user upgrade level",
            responses = {
                    @ApiResponse(responseCode = "200", description = "User upgrade incremented"),
                    @ApiResponse(responseCode = "400", description = "Invalid request")
            }
    )
    public UserUpgradeResponse incrementUserUpgrade(@Valid @RequestBody UserUpgradeRequest request) {
        return userUpgradeFacade.incrementUserUpgrade(request);
    }

    @GetMapping
    @Operation(
            summary = "List all upgrades for user",
            responses = {
                    @ApiResponse(responseCode = "200", description = "User upgrades listed")
            }
    )
    public List<UserUpgradeResponse> getUserUpgrades(@RequestParam UUID userId) {
        return userUpgradeFacade.listUserUpgrades(userId);
    }
}