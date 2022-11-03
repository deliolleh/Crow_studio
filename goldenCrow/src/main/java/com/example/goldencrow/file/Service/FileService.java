package com.example.goldencrow.file.Service;


import com.example.goldencrow.file.FileDto.FileCreateDto;
import com.example.goldencrow.file.FileEntity;
import com.example.goldencrow.file.Repository.FileRepository;
import com.example.goldencrow.team.entity.TeamEntity;
import com.example.goldencrow.team.repository.TeamRepository;
import com.example.goldencrow.user.JwtService;
import com.example.goldencrow.user.repository.UserRepository;
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
import java.util.Optional;

@Service
public class FileService {

    @Autowired
    private TeamRepository teamRepository;

    @Autowired
    private FileRepository fileRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtService jwtService;

    /** 파일 생성 로직
     * 파일이 성공적으로 생성되면 true
     * 아니면 false 반환*/
    public boolean createFile(FileCreateDto fileCreateDto, Integer type, Long teamSeq) {
        String newFilePath = fileCreateDto.getFilePath() + "/"+ fileCreateDto.getFileTitle();

        Optional<TeamEntity> team = teamRepository.findByTeamSeq(teamSeq);
        File newFile = new File(newFilePath);
        FileCreateDto newFileCreateDto = new FileCreateDto(fileCreateDto.getFileTitle(),newFilePath);
        FileEntity fileEntity = new FileEntity(newFileCreateDto,team.get());

        try{
            if (type == 1){
                if(newFile.createNewFile()) {
                    fileRepository.saveAndFlush(fileEntity);
                    return true;
                } else {
                    System.out.println("here");
                    return false;
                }
            } else {
                if (newFile.mkdir()) {
                    fileRepository.saveAndFlush(fileEntity);
                    return true;
                } else {
                    return false;
                }
            }
        } catch (IOException e) {
            System.out.println(e);
            return false;
        }
    }
    /** 파일 삭제  */
    public boolean deleteFile(String filePath,Integer type, Long teamSeq) {
        Path path = Paths.get(filePath);
        if (!fileRepository.findByTeam_TeamSeqAndFilePath(teamSeq,filePath).isPresent()) {
            return false;
        }

        FileEntity file = fileRepository.findByTeam_TeamSeqAndFilePath(teamSeq,filePath).get();

        if (type == 1) {
            ProcessBuilder pb = new ProcessBuilder();
            pb.command("sudo","rm","-r",filePath);
            pb.directory(new File(String.format("/home/ubuntu/crow_data/%d",file.getTeam().getTeamSeq())));

            try{
                pb.start();
            } catch (IOException e) {
                return false;
            }

        } else {

            try {
                Files.delete(path);
            } catch (NoSuchFileException e) {
                return false;
            } catch (IOException e) {
                return false;
            }

        }

        fileRepository.delete(file);
        return true;
    }

    public boolean deleteProfile(String path, Integer type) {
        if (type == 1) {
            ProcessBuilder pb = new ProcessBuilder();
            pb.command("sudo","rm","-r",path);
            pb.directory(new File(path));

            try{
                pb.start();
            } catch (IOException e) {
                return false;
            }

        } else {
            Path path1 = Paths.get(path);
            try {
                Files.delete(path1);
            } catch (NoSuchFileException e) {
                return false;
            } catch (IOException e) {
                return false;
            }
        }
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
