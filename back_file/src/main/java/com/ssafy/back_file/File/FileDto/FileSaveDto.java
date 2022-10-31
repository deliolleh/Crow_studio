package com.ssafy.back_file.File.FileDto;

import lombok.Data;

import javax.persistence.Lob;
import java.sql.Clob;
import java.time.LocalDateTime;

@Data
public class FileSaveDto {
    private LocalDateTime fileUpdatedAt;

}
