package com.example.goldencrow.user.dto;

import com.example.goldencrow.user.entity.UserEntity;
import lombok.Data;

@Data
public class MyInfoDto {

    private Long userSeq;
    private String userId;
    private String userNickname;
    private String userProfile;

    private String userGitUsername;
    private String userGitToken;

    private UserInfoDto.Result result;

    public MyInfoDto() {
    }

    public MyInfoDto(UserEntity userEntity) {
        this.userSeq = userEntity.getUserSeq();
        this.userId = userEntity.getUserId();
        this.userNickname = userEntity.getUserNickname();
        this.userProfile = userEntity.getUserProfile();

        if(userEntity.getUserGitUsername()==null) {
            this.userGitUsername = "";
        } else {
            this.userGitUsername = userEntity.getUserGitUsername();
        }

        // 패스워드는 디코딩 해야해서...

    }

}
