package com.example.goldencrow.file.fileDto;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class FileSaveDto {
    private LocalDateTime fileUpdatedAt;
}