package com.example.goldencrow.team.dto;

import com.example.goldencrow.team.entity.TeamEntity;
import com.example.goldencrow.user.entity.UserEntity;
import lombok.Data;

import java.util.List;

@Data
public class TeamDto {

    private Long teamSeq;
    private String teamName;
    private Long teamLeaderSeq;
    private String teamLeaderNickname;
    private String teamLeaderProfile;

    private List<MemberDto> memberDtoList;

    public TeamDto() {
    }

    public TeamDto(TeamEntity team) {
        this.teamSeq = team.getTeamSeq();
        this.teamName = team.getTeamName();

        UserEntity userEntity = team.getTeamLeader();
        this.teamLeaderSeq = userEntity.getUserSeq();
        this.teamLeaderNickname = userEntity.getUserNickname();
        this.teamLeaderProfile = userEntity.getUserProfile();

        // 멤버 리스트는 따로 넣어줘야 함
    }
}
