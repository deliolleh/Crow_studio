package com.ssafy.back_file.File.Service;



import com.ssafy.back_file.File.FileDto.FileCreateDto;
import com.ssafy.back_file.File.FileEntity;
import com.ssafy.back_file.File.Repository.FileRepository;
import com.ssafy.back_file.Team.TeamEntity;
import com.ssafy.back_file.Team.TeamRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.NoSuchFileException;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Date;

@Service
public class FileService {

    private TeamRepository teamRepository;


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
        if (!fileRepository.findByTeam_TeamSeqAndFilePath(teamSeq,filePath).isPresent()) {
            return false;
        }

        FileEntity file = fileRepository.findByTeam_TeamSeqAndFilePath(teamSeq,filePath).get();

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

    public boolean saveFile(String filePath, String content) {
        File oldFile = new File(filePath);
        oldFile.delete();
        File newFile = new File(filePath);
        Date newUpdatedAt = new Date();
        try {
            FileWriter overWriteFile = new FileWriter(newFile, false);
            overWriteFile.write(content);
            overWriteFile.close();
        } catch (IOException e) {
            return false;
        }

        return true;
    }
    @Transactional
    public boolean updateFileUpdatedAt(Long teamSeq, String filePath){
        boolean isPossible = fileRepository.findByTeam_TeamSeqAndFilePath(teamSeq, filePath).isPresent();
        if (!isPossible) {
            return false;
        }
        FileEntity nFile = fileRepository.findByTeam_TeamSeqAndFilePath(teamSeq, filePath).get();
        nFile.setFileUpdatedAt(new Date());
        fileRepository.saveAndFlush(nFile);
        return true;
    }

    @Transactional
    public boolean updateFileNameUpdatedAt(Long teamSeq, String filePath, String newFileName) {
        boolean isPossible = fileRepository.findByTeam_TeamSeqAndFilePath(teamSeq, filePath).isPresent();

        if (!isPossible) {
            return false;
        }
        FileEntity nFile = fileRepository.findByTeam_TeamSeqAndFilePath(teamSeq, filePath).get();
        nFile.setFileUpdatedAt(new Date());
        nFile.setFileTitle(newFileName);
        fileRepository.saveAndFlush(nFile);
        return true;
    }

}
