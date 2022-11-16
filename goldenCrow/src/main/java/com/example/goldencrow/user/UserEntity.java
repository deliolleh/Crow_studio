package com.example.goldencrow.user;

import lombok.Data;
import org.hibernate.annotations.DynamicUpdate;

import javax.persistence.*;

/**
<<<<<<< HEAD
 * user Table Entity
=======
 * User Table Entity
>>>>>>> 554358d6ef72e62a311b25937821dd557a60dd0d
 */
@Entity
@DynamicUpdate
@Table(name = "user")
@Data
public class UserEntity {

    /**
     * Primary Key
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column
    private Long userSeq;

    @Column
    private String userId;

    @Column
    private String userPassWord;

    @Column
    private String userNickname;

    @Column
    private String userSettings;

    @Column
    private String userProfile;

    @Column
    private String userGitUsername;

    @Column
    private String userGitToken;

    /**
<<<<<<< HEAD
     * 빈 userEntity 생성자
=======
     * 빈 UserEntity 생성자
>>>>>>> 554358d6ef72e62a311b25937821dd557a60dd0d
     */
    public UserEntity() {
    }

    /**
<<<<<<< HEAD
     * userEntity 생성자
=======
     * UserEntity 생성자
>>>>>>> 554358d6ef72e62a311b25937821dd557a60dd0d
     *
     * @param userId 사용자의 아이디
     * @param userNickname 사용자의 닉네임
     */
    public UserEntity(String userId, String userNickname) {
        this.userId = userId;
        this.userNickname = userNickname;
        this.userSettings = "";

        // userPassword는 service 단에서 encoding을 거쳐 기록

    }
}
