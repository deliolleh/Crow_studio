package com.example.goldencrow.user.dto;

import com.example.goldencrow.user.UserEntity;
import lombok.Data;

/**
 * 외부인의 회원정보 조회에 출력으로 사용될 DTO
 */
@Data
public class UserInfoDto {

    public String result;
    private Long userSeq;
    private String userId;
    private String userNickname;
    private String userProfile;

    /**
     * 빈 UserInfoDto 생성자
     */
    public UserInfoDto() {
    }

    /**
     * UserInfoDto 생성자
     *
     * @param userEntity 사용자의 UserEntity
     */
    public UserInfoDto(UserEntity userEntity) {
        this.userSeq = userEntity.getUserSeq();
        this.userId = userEntity.getUserId();
        this.userNickname = userEntity.getUserNickname();
        this.userProfile = userEntity.getUserProfile();
    }
}
