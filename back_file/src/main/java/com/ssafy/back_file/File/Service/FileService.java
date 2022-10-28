package com.ssafy.back_file.File.Service;



import com.ssafy.back_file.File.FileCreateDto;
import com.ssafy.back_file.File.FileEntity;
import com.ssafy.back_file.File.Repository.FileRepository;
import com.ssafy.back_file.Team.TeamEntity;
import com.ssafy.back_file.Team.TeamRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.NoSuchFileException;
import java.nio.file.Path;
import java.nio.file.Paths;

@Service
public class FileService {
    @Autowired
    private TeamRepository teamRepository;

    @Autowired
    private FileRepository fileRepository;
    /** 파일 생성 로직
     * 파일이 성공적으로 생성되면 true
     * 아니면 false 반환*/
    public boolean createFile(FileCreateDto fileCreateDto, Long teamSeq) {
        TeamEntity team = teamRepository.findByTeamSeq(teamSeq);
        String newFilePath = fileCreateDto.getFilePath() + "\\" + fileCreateDto.getFileTitle();
        File newFile = new File(newFilePath);
        FileEntity fileEntity = new FileEntity(fileCreateDto,team);

        try{
            if(newFile.createNewFile()) {
                fileRepository.saveAndFlush(fileEntity);
                return true;
            } else {
                return false;
            }
        } catch (IOException e) {
            return false;
        }
    }

    public boolean deleteFile(String filePath, Long teamSeq) {
        Path path = Paths.get(filePath);
        TeamEntity team = teamRepository.findByTeamSeq(teamSeq);
        FileEntity file = fileRepository.findByTeamAndFilePath(team, filePath);
        if (file == null) {
            return false;
        }
        try {
            Files.delete(path);
        } catch (NoSuchFileException e) {
            return false;
        } catch (IOException e) {
            return false;
        }
        fileRepository.delete(file);
        return true;
    }

}
