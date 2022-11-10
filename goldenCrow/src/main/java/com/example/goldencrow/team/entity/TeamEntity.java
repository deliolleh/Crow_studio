package com.example.goldencrow.team.entity;

import com.example.goldencrow.user.entity.UserEntity;
import lombok.Data;
import org.hibernate.annotations.DynamicUpdate;

import javax.persistence.*;

@Entity
@DynamicUpdate
@Table(name = "team")
@Data
public class TeamEntity {

    //pk
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column
    private Long teamSeq;

    @Column
    private String teamName;

    @ManyToOne
    @JoinColumn(name="teamLeaderSeq", referencedColumnName = "userSeq")
    private UserEntity teamLeader;

    @Column
    private String teamGit;

    @Column (name = "teamType")
    private Integer type;

    public TeamEntity() {
    }

    public TeamEntity(UserEntity userEntity, String teamName, Integer type) {
        this.teamLeader = userEntity;
        this.teamName = teamName;
        this.type = type;
    }
}
