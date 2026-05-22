package com.sandsational.backend.mapper;

import com.sandsational.backend.data.model.UserUpgrade;
import com.sandsational.backend.dto.response.UserUpgradeResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class UserUpgradeMapper {
    private final UserMapper userMapper;
    private final UpgradeMapper upgradeMapper;

    @Autowired
    public UserUpgradeMapper(UserMapper userMapper, UpgradeMapper upgradeMapper) {
        this.userMapper = userMapper;
        this.upgradeMapper = upgradeMapper;
    }

    public UserUpgradeResponse toResponse(UserUpgrade userUpgrade){
        return new UserUpgradeResponse(
                userMapper.toResponse(userUpgrade.getUser()),
                upgradeMapper.toResponse(userUpgrade.getUpgrade()),
                userUpgrade.getLevel()
        );
    }
}
