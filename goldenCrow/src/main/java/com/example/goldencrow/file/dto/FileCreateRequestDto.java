package com.example.goldencrow.file.dto;

import lombok.Data;

@Data
public class FileCreateRequestDto {
    private String fileTitle;
    private String filePath;
    private Long teamSeq;


    public FileCreateRequestDto() {};

    public FileCreateRequestDto(String fileTitle, String filePath) {
        this.fileTitle = fileTitle;
        this.filePath = filePath;
    }
}
