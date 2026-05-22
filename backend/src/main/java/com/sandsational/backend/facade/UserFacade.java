package com.sandsational.backend.facade;

import com.sandsational.backend.dto.request.CreateUserRequest;
import com.sandsational.backend.dto.response.UserResponse;
import com.sandsational.backend.mapper.UserMapper;
import com.sandsational.backend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@Transactional
public class UserFacade {
    private final UserService userService;
    private final UserMapper userMapper;

    @Autowired
    public UserFacade(UserService userService, UserMapper userMapper){
        this.userService = userService;
        this.userMapper = userMapper;
    }

    public UserResponse createUser(CreateUserRequest dto){
        return userMapper.toResponse(userService.createUser(dto.username(), dto.email(), dto.password()));
    }

    @Transactional(readOnly = true)
    public UserResponse getUser(UUID id){
        return userMapper.toResponse(userService.getUser(id));
    }

    @Transactional(readOnly = true)
    public List<UserResponse> getUsers(){
        return userService.getUsers()
                .stream()
                .map(userMapper::toResponse)
                .toList();
    }
}
