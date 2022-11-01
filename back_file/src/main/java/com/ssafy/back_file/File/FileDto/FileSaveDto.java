package com.ssafy.back_file.File.FileDto;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class FileSaveDto {
    private LocalDateTime fileUpdatedAt;
}
