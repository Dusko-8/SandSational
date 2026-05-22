package com.sandsational.backend.data.model;

import jakarta.persistence.*;
import lombok.Getter;

import java.util.UUID;

@Entity
@Table(name="game_user_upgrade")
@Getter
public class UserUpgrade {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name="id_user_upgrade")
    private UUID id;

    @ManyToOne(fetch=FetchType.LAZY, optional = false)
    @JoinColumn(name="id_user", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "id_upgrade", nullable = false)
    private Upgrade upgrade;

    @Column(name = "level", nullable = false)
    private int level = 0;

    public void incrementLevel(){
        this.level++;
    }

    public UserUpgrade(){}

    public UserUpgrade(User user, Upgrade upgrade){
        this.user = user;
        this.upgrade = upgrade;
        this.level = 0;
    }
}
