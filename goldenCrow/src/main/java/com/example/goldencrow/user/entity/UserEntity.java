package com.example.goldencrow.user.entity;

import lombok.Data;
import org.hibernate.annotations.DynamicUpdate;
import org.json.JSONObject;
import springfox.documentation.spring.web.json.Json;

import javax.persistence.*;
import java.util.Date;

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
    private String userRefresh;

    public UserEntity() {
    }

    public UserEntity(String userId, String userNickname) {
        this.userId = userId;
        this.userNickname = userNickname;
        this.userSettings = "";
        // 패스워드와 리프레시 토큰은 jwt서비스를 거쳐서 처리
    }
}
