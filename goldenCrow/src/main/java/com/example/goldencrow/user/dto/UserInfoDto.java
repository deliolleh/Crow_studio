package com.example.goldencrow.user.dto;

import com.example.goldencrow.user.UserEntity;
import lombok.Data;

@Data
public class UserInfoDto {

    public enum Result {
        SUCCESS, FAILURE, EXPIRE
    }

    private Long userSeq;
    private String userId;
    private String userNickname;
    private String userProfile;
    private Result result;

    public UserInfoDto() {
    }

    public UserInfoDto(UserEntity userEntity) {
        this.userSeq = userEntity.getUserSeq();
        this.userId = userEntity.getUserId();
        this.userNickname = userEntity.getUserNickname();
        this.userProfile = userEntity.getUserProfile();
    }
}
