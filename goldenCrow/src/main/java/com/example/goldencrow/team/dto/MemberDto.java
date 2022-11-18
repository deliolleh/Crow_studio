package com.example.goldencrow.team.dto;

import com.example.goldencrow.team.entity.MemberEntity;
import com.example.goldencrow.user.UserEntity;
import lombok.Data;

@Data
public class MemberDto {

    private Long memberSeq;

    private String memberNickname;

    private String memberProfile;

    public MemberDto() {
    }

    public MemberDto(MemberEntity memberEntity) {
        UserEntity userEntity = memberEntity.getUser();
        this.memberSeq = userEntity.getUserSeq();
        this.memberNickname = userEntity.getUserNickname();
        this.memberProfile = userEntity.getUserProfile();
    }

}
