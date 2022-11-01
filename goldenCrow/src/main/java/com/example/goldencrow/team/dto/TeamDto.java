package com.example.goldencrow.team.dto;

import com.example.goldencrow.team.entity.TeamEntity;
import lombok.Data;

@Data
public class TeamDto {

    private Long teamSeq;
    private String teamName;
    private Long teamLeaderSeq;
    private String teamLeaderNickname;

    public TeamDto() {
    }

    public TeamDto(TeamEntity team) {
        this.teamSeq = team.getTeamSeq();
        this.teamName = team.getTeamName();
        this.teamLeaderSeq = team.getTeamLeader().getUserSeq();
        this.teamLeaderNickname = team.getTeamLeader().getUserNickname();
    }
}
