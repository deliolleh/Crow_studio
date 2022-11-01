package com.ssafy.back_file.Team;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface TeamRepository extends JpaRepository<TeamEntity, Long> {
    /** 팀 시퀀스로 팀 조회 */
    Optional<TeamEntity> findByTeamSeq(Long teamSeq);
}
