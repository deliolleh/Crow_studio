package com.example.goldencrow.user.repository;

import com.example.goldencrow.user.entity.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<UserEntity, Long> {

    Optional<UserEntity> findUserEntityByUserId(String userId);

    List<UserEntity> findAllByUserIdContainingOrUserNicknameContaining(String word1, String word2);

    UserEntity findByUserSeq(Long userSeq);

}
