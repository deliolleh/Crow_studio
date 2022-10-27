package com.ssafy.back_file.File;

import lombok.Data;

import java.time.LocalDateTime;

@Data
/** 파일 생성 DTO
 * 파일 이름과 경로만! */
public class FileCreateDto {
    private String fileTitle;
    private String filePath;
}
