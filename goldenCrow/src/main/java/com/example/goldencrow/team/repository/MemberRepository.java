package com.example.goldencrow.team.repository;

import com.example.goldencrow.team.entity.MemberEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface MemberRepository extends JpaRepository<MemberEntity, Long> {

    List<MemberEntity> findAllByUser_UserSeq(Long userSeq);

    Optional<MemberEntity> findByUser_UserSeqAndTeam_TeamSeq(Long userSeq, Long teamSeq);

    List<MemberEntity> findAllByTeam_TeamSeq(Long teamSeq);

}
