package com.ssafy.back_file.user;

import com.ssafy.back_file.Team.TeamEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends JpaRepository<UserEntity, Long> {
    //UserEntity findByUserSeq(Long userSeq);
}
