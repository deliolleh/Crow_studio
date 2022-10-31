package com.ssafy.back_file.File.FileDto;

import lombok.Data;
import lombok.Getter;

/** 파일 생성 DTO
 * 파일 이름과 경로만! */
@Data @Getter
public class FileCreateDto {
    private String fileTitle;
    private String filePath;
}
