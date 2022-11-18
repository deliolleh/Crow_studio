package com.example.goldencrow.team.entity;

import com.example.goldencrow.user.UserEntity;
import lombok.Data;
import org.hibernate.annotations.DynamicUpdate;

import javax.persistence.*;

/**
 * Team Table Entity
 */
@Entity
@DynamicUpdate
@Table(name = "team")
@Data
public class TeamEntity {

    /**
     * Primary Key
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column
    private Long teamSeq;

    @Column
    private String teamName;

    @ManyToOne
    @JoinColumn(name = "teamLeaderSeq", referencedColumnName = "userSeq")
    private UserEntity teamLeader;

    @Column
    private String teamGit;

    @Column(name = "teamType")
    private int type;

    /**
     * 빈 TeamEntity 생성자
     */
    public TeamEntity() {
    }

    /**
     * TeamEntity 생성자
     *
     * @param userEntity 사용자의 UserEntity
     * @param teamName    만들고자 하는 팀의 이름
     * @param projectType 해당 팀에서 작업할 프로젝트의 종류
     */
    public TeamEntity(UserEntity userEntity, String teamName, int projectType) {
        this.teamLeader = userEntity;
        this.teamName = teamName;
        this.type= projectType;
    }
}
