package com.sandsational.backend.mapper;

import com.sandsational.backend.data.model.User;
import com.sandsational.backend.dto.response.UserResponse;
import org.springframework.stereotype.Component;

@Component
public class UserMapper {
    public UserResponse toResponse (User user){
        return new UserResponse(
                user.getId(),
                user.getUsername(),
                user.getEmail()
        );
    }
}
