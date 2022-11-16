package com.example.goldencrow.file;


import com.example.goldencrow.file.dto.FileCreateDto;
import com.mongodb.lang.Nullable;
import com.sun.istack.NotNull;
import lombok.Getter;
import lombok.Setter;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.mapping.Document;

import javax.persistence.*;
import java.util.Date;

@Document(collection = "file")
@Getter @Setter
public class FileEntity {
    // 파일, 팀, 멤버 pk
    // 제목, 경로, 작성일자, 수정일자

    @Id @NotNull
    private ObjectId id;
    @NotNull
    private Long teamSeq;
    @NotNull
    private String fileTitle;
    @NotNull
    private String filePath;


    @CreatedDate
    @Column(updatable = false)
    private Date fileCreatedAt;

    @LastModifiedDate
    private Date fileUpdatedAt;

    public FileEntity() {
    }

    ;

    public FileEntity(FileCreateDto fileCreateDto) {
        this.fileTitle = fileCreateDto.getFileTitle();
        this.filePath = fileCreateDto.getFilePath();
        this.teamSeq = fileCreateDto.getTeamSeq();
    }


}
