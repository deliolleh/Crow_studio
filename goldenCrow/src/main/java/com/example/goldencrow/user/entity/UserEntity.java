package com.example.goldencrow.user.entity;

import lombok.Data;
import org.hibernate.annotations.DynamicUpdate;

import javax.persistence.*;

@Entity
@DynamicUpdate
@Table(name = "user")
@Data
public class UserEntity {

    //pk
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
    private String userGitId;

    @Column
    private String userGitPassword;

    @Column
    private String userRefresh;

    public UserEntity() {
    }

    public UserEntity(String userId, String userNickname) {
        this.userId = userId;
        this.userNickname = userNickname;
        this.userSettings = "";
        // 패스워드는 인코딩해서 따로 처리
        // 리프레시 토큰은 jwt서비스를 거쳐서 처리
    }
}
