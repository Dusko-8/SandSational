package com.sandsational.backend.rest;

import com.sandsational.backend.dto.response.UpgradeResponse;
import com.sandsational.backend.facade.UpgradeFacade;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@Tag(name="Upgrades", description = "Upgrade management")
@RestController
@RequestMapping(value = "/api/upgrades", produces = MediaType.APPLICATION_JSON_VALUE)
public class UpgradeController {
    private final UpgradeFacade upgradeFacade;

    @Autowired
    public UpgradeController(UpgradeFacade upgradeFacade){
        this.upgradeFacade = upgradeFacade;
    }

    @GetMapping
    @Operation(
            summary = "List all upgrades",
            responses = {
                    @ApiResponse(responseCode = "200", description = "Upgrades listed"),
                    @ApiResponse(responseCode = "401", description = "Unauthenticated user")
            }
    )
    public List<UpgradeResponse> getUpgrades(){
        return upgradeFacade.findAll();
    }
}
