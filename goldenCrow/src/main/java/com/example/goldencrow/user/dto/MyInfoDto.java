package com.example.goldencrow.user.dto;

import com.example.goldencrow.user.UserEntity;
import lombok.Data;

/**
 * 회원정보 조회에 출력으로 사용될 dto
 */
@Data
public class MyInfoDto {

    private String result;
    private Long userSeq;
    private String userId;
    private String userNickname;
    private String userProfile;
    private String userGitUsername;
    private String userGitToken;

    /**
     * 빈 MyInfoDto 생성자
     */
    public MyInfoDto() {
    }

    /**
     * MyInfoDto 생성자
     *
     * @param userEntity 사용자의 UserEntity
     */
    public MyInfoDto(UserEntity userEntity) {
        this.userSeq = userEntity.getUserSeq();
        this.userId = userEntity.getUserId();
        this.userNickname = userEntity.getUserNickname();
        this.userProfile = userEntity.getUserProfile();

        if (userEntity.getUserGitUsername() == null) {
            this.userGitUsername = "";
        } else {
            this.userGitUsername = userEntity.getUserGitUsername();
        }

        // userGitToken은 service 단에서 encoding을 거쳐 기록

    }

}
