package com.example.goldencrow.file.dto;

import lombok.Data;

/** 파일 생성 DTO
 * 파일 이름과 경로만! */
@Data
public class FileCreateDto {
    private String fileTitle;
    private String filePath;
    private Long teamSeq;


    public FileCreateDto() {};

    public FileCreateDto(String fileTitle, String filePath, Long teamSeq) {
        this.fileTitle = fileTitle;
        this.filePath = filePath;
        this.teamSeq = teamSeq;
    }
}
