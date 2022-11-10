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

    private String teamGit;

    private String projectType;

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

        if(team.getTeamGit()==null) {
            this.teamGit = "";
        } else {
            this.teamGit = team.getTeamGit();
        }

        if(team.getType()==null){
            this.projectType = "none";
        } else {
            switch (team.getType().intValue()){
                case(1) : this.projectType = "pure Python"; break;
                case(2) : this.projectType = "Django"; break;
                case(3) : this.projectType = "Flask"; break;
                case(4) : this.projectType = "FastAPI"; break;
                default : this.projectType = "none"; break;
            }
        }

        // 멤버 리스트는 따로 넣어줘야 함
    }
}
