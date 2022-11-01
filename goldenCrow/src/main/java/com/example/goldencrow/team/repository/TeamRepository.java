package com.example.goldencrow.team.repository;

import com.example.goldencrow.team.entity.TeamEntity;
import com.example.goldencrow.user.entity.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface TeamRepository extends JpaRepository<TeamEntity, Long> {

    Optional<TeamEntity> findTeamEntityByTeamLeaderAndTeamName(UserEntity user,String teamName);

    Optional<TeamEntity> findByTeamSeqAndTeamLeader_UserSeq(Long teamSeq, Long userSeq);


}
