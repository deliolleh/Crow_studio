package com.example.goldencrow.team.dto;

import com.example.goldencrow.team.entity.TeamEntity;
import com.example.goldencrow.user.UserEntity;
import lombok.Data;

import java.util.List;

/**
 * 팀 정보 조회에 출력으로 사용될 DTO
 */
@Data
public class TeamDto {

    private String result;
    private Long teamSeq;
    private String teamName;
    private Long teamLeaderSeq;
    private String teamLeaderNickname;
    private String teamLeaderProfile;

    private String teamGit;

    private List<MemberDto> memberDtoList;

    /**
     * 빈 TeamDto 생성자
     */
    public TeamDto() {
    }

    /**
     * TeamDto 생성자
     *
     * @param teamEntity 팀의 TeamEntity
     */
    public TeamDto(TeamEntity teamEntity) {
        this.teamSeq = teamEntity.getTeamSeq();
        this.teamName = teamEntity.getTeamName();

        UserEntity userEntity = teamEntity.getTeamLeader();
        this.teamLeaderSeq = userEntity.getUserSeq();
        this.teamLeaderNickname = userEntity.getUserNickname();
        this.teamLeaderProfile = userEntity.getUserProfile();

        if (teamEntity.getTeamGit() == null) {
            this.teamGit = "";
        } else {
            this.teamGit = teamEntity.getTeamGit();
        }

        // memberDtoList는 service 단에서 별도 처리 후 삽입

    }
}
