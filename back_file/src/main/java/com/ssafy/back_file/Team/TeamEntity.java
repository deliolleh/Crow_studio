package com.ssafy.back_file.Team;

import com.ssafy.back_file.File.FileEntity;
import com.ssafy.back_file.user.UserEntity;
import lombok.Getter;
import org.hibernate.annotations.DynamicUpdate;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@DynamicUpdate
@Table(name = "team")
@Getter
public class TeamEntity {

    //pk
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column
    private Long teamSeq;

    @ManyToOne
    @JoinColumn(name="userSeq", referencedColumnName = "userSeq")
    private UserEntity user;

    @Column
    private String teamName;

    @ManyToOne
    @JoinColumn(name="teamLeaderSeq", referencedColumnName = "userSeq")
    private UserEntity teamLeader;

    public TeamEntity() {
    }

    public TeamEntity(String teamName) {
        this.teamName = teamName;
        // User들은 서비스에서 등록하자~
    }
}


