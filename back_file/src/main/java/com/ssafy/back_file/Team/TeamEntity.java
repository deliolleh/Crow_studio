package com.ssafy.back_file.Team;

import com.ssafy.back_file.File.FileEntity;
import lombok.Getter;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
public class TeamEntity {
    @Id
    @GeneratedValue
    @Column(name="teamSeq")
    private Long teamSeq;

    private Long userSeq;

    private String teamName;

    @OneToMany(mappedBy = "team", cascade = CascadeType.ALL)
    private List<FileEntity> files = new ArrayList<>();

}
