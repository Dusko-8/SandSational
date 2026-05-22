package com.sandsational.backend.data.model;

import jakarta.annotation.Nonnull;
import jakarta.persistence.*;
import lombok.Getter;
import org.jspecify.annotations.NonNull;

import java.io.Serializable;
import java.util.UUID;

@Entity
@Getter
@Table(name="game_user")
public class User implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name="id_user")
    private UUID id;

    @Column(name="email", unique = true, length = 50)
    @Nonnull
    private String email;

    @Column(name="username", unique = true, length = 25)
    @Nonnull
    private String username;

    @Column(name="password")
    @Nonnull
    private String password;

    public User(@NonNull String email, @NonNull String username, @NonNull String password){
        this.email = email;
        this.username = username;
        this.password = password;
    }

    public User() {
    }


    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof User user)) return false;

        return email.equals(user.email) && username.equals(user.username);
    }

    @Override
    public int hashCode() {
        int result = email.hashCode();
        result = 31 * result + username.hashCode();

        return result;
    }
}
