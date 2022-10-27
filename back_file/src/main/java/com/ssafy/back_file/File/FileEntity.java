package com.ssafy.back_file.File;


import com.ssafy.back_file.Team.TeamEntity;
import lombok.Getter;

import javax.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Getter
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

    private LocalDateTime fileCreatedAt;

    private LocalDateTime fileUpdatedAt;

}
