//package com.ssafy.back_file.File;
//
//import com.ssafy.back_file.Team.TeamEntity;
//import lombok.Data;
//
//import java.time.LocalDateTime;
//
//@Data
//public class FileDto {
//
//    private Long fileSeq;
//
//    private TeamEntity team;
//
//    private String fileTitle;
//
//    private String filePath;
//
//    private LocalDateTime createdAt;
//
//    private LocalDateTime updatedAt;
//
//    public FileDto() {};
//
//    public FileDto(FileEntity fileEntity) {
//        this.fileSeq = fileEntity.getFileSeq();
//        this.team = fileEntity.getTeam();
//        this.fileTitle = fileEntity.getFileTitle();
//        this.filePath = fileEntity.getFilePath();
//        this.createdAt = fileEntity.getFileCreatedAt();
//        this.updatedAt = fileEntity.getFileUpdatedAt();
//    }
//
//}
