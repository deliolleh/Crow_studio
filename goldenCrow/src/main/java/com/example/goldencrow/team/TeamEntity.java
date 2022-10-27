package com.example.goldencrow.team;

import com.example.goldencrow.user.entity.UserEntity;
import lombok.Data;
import org.hibernate.annotations.DynamicUpdate;

import javax.persistence.*;

@Entity
@DynamicUpdate
@Table(name = "user")
@Data
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
    @JoinColumn(name="userSeq", referencedColumnName = "userSeq")
    private UserEntity teamLeader;

    public TeamEntity() {
    }

    public TeamEntity(String teamName) {
        this.teamName = teamName;
        // User들은 서비스에서 등록하자~
    }
}
