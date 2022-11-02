package com.example.goldencrow.file;


import com.example.goldencrow.file.FileDto.FileCreateDto;
import com.example.goldencrow.team.entity.TeamEntity;
import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;

import javax.persistence.*;
import java.util.Date;

@Entity
@Getter @Setter
@Table(name = "file")
public class FileEntity {
    // 파일, 팀, 멤버 pk
    // 제목, 경로, 작성일자, 수정일자

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "fileSeq")
    private Long fileSeq;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "teamSeq")
    private TeamEntity team;

    private String fileTitle;

    private String filePath;

    @CreatedDate
    @Column(updatable = false)
    private Date fileCreatedAt;

    @LastModifiedDate
    private Date fileUpdatedAt;

    public FileEntity() {};

    public FileEntity(FileCreateDto fileCreateDto, TeamEntity team) {
        this.fileTitle = fileCreateDto.getFileTitle();
        this.filePath = fileCreateDto.getFilePath();
        this.team = team;
        this.fileCreatedAt = new Date();
        this.fileUpdatedAt = new Date();
    }



}
