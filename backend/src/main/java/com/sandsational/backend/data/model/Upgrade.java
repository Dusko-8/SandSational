package com.sandsational.backend.data.model;

import jakarta.annotation.Nonnull;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.UUID;

@Entity
@Table(name="game_upgrade")
@Getter
public class Upgrade {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name="id_upgrade")
    private UUID id;

    @Column(name="max_lvl", nullable = false)
    @Setter
    private int maxLvl;

    @Column(name="upgrade_name", unique = true)
    @Nonnull
    @Setter
    private String name;

    @Column(name="upgrade_description")
    @Nonnull
    @Setter
    private String description;

    @Column(name="upgrade_icon_key")
    @Setter
    private String iconKey;

    @Column(name="upgrade_code", unique = true)
    @Nonnull
    private String code;

    @Column(name="upgrade_init_price")
    @Nonnull
    @Setter
    private Long initialPrice;

    public Upgrade(){}
    public Upgrade(int maxLvl,
                   @Nonnull String name,
                   @Nonnull String description,
                   @Nonnull String iconKey,
                   @Nonnull String code,
                   @Nonnull Long initialPrice
    ){
        this.maxLvl = maxLvl;
        this.name = name;
        this.description = description;
        this.iconKey = iconKey;
        this.code = code;
        this.initialPrice = initialPrice;
    }
}
