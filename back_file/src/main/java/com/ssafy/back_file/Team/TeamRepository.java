package com.ssafy.back_file.Team;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TeamRepository extends JpaRepository<TeamEntity, Long> {
    /** 팀 시퀀스로 팀 조회 */
    TeamEntity findByTeamSeq(Long teamSeq);
}
