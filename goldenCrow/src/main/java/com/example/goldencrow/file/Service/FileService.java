package com.example.goldencrow.file.Service;


import com.example.goldencrow.file.FileDto.FileCreateDto;


import com.example.goldencrow.team.entity.TeamEntity;
import com.example.goldencrow.team.repository.TeamRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;


import java.io.*;
import java.nio.file.Files;
import java.nio.file.NoSuchFileException;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;

import java.util.List;
import java.util.Optional;
import java.util.logging.Logger;

import static java.lang.System.out;

@Service
public class FileService {

    @Autowired
    private TeamRepository teamRepository;


    /** 파일 생성 로직
     * 파일이 성공적으로 생성되면 true
     * 아니면 false 반환*/
    public boolean createFile(FileCreateDto fileCreateDto, Integer type, Long teamSeq) {
        String newFilePath = fileCreateDto.getFilePath() + "/"+ fileCreateDto.getFileTitle();

        Optional<TeamEntity> team = teamRepository.findByTeamSeq(teamSeq);
        File newFile = new File(newFilePath);
//        FileCreateDto newFileCreateDto = new FileCreateDto(fileCreateDto.getFileTitle(),newFilePath);
//        FileEntity fileEntity = new FileEntity(newFileCreateDto,team.get());

        try{
            if (type == 2){
                if(newFile.createNewFile()) {
                    //fileRepository.saveAndFlush(fileEntity);
                    return true;
                } else {
                    System.out.println("here");
                    return false;
                }
            } else {
                if (newFile.mkdir()) {
                    //fileRepository.saveAndFlush(fileEntity);
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

        // 만약 이게 DB에 없는 파일 경로나 그렇다면 실패!
//        if (!fileRepository.findByTeam_TeamSeqAndFilePath(teamSeq,filePath).isPresent()) {
//            return false;
//        }
        
//        FileEntity file = fileRepository.findByTeam_TeamSeqAndFilePath(teamSeq,filePath).get();
        // 디렉토리라면
        if (type == 1) {
            ProcessBuilder pb = new ProcessBuilder();
            pb.command("rm","-r",filePath);

            try{
                pb.start();
            } catch (IOException e) {
                System.out.println(e.getMessage());
                return false;
            }
        // 파일 이라면
        } else {
            try {
                Files.delete(path);
            } catch (NoSuchFileException e) {
                return false;
            } catch (IOException ioe) {
                out.println(ioe.getMessage());
                return false;
            }

        }

        //ileRepository.delete(file);
        return true;
    }

    /**
     * 파일 저장 기존 파일을 삭제하고 새로운 파일을 덮어씌우는 형태
     * @param filePath
     * @param content
     * @return
     */
    public String saveFile(String filePath, String content) {
        File oldFile = new File(filePath);
        oldFile.delete();

        File newFile = new File(filePath);

        try (FileWriter overWriteFile = new FileWriter(newFile, false);) {
            overWriteFile.write(content);
        } catch (IOException e) {
            return e.getMessage();
        }

        return "Success";
    }
//    @Transactional
//    public boolean updateFileUpdatedAt(Long teamSeq, String filePath){
//        boolean isPossible = fileRepository.findByTeam_TeamSeqAndFilePath(teamSeq, filePath).isPresent();
//        if (!isPossible) {
//            return false;
//        }
//        FileEntity nFile = fileRepository.findByTeam_TeamSeqAndFilePath(teamSeq, filePath).get();
//        nFile.setFileUpdatedAt(new Date());
//        fileRepository.saveAndFlush(nFile);
//        return true;
//    }

    /**
     * 파일 updatedat 업데이트 함수 안씁니다.
     * @param filePath
     * @return
     */
    public boolean updateFileName(String filePath, String newFileName,String oldFileName) {
        String newFilePath = filePath;
        String renameFilePath = filePath.replace(oldFileName, newFileName);
        File targetFile = new File(newFilePath);
        File reNameFile = new File(renameFilePath);

        return targetFile.renameTo(reNameFile);
        //FileEntity nFile = fileRepository.findByTeam_TeamSeqAndFilePath(teamSeq, filePath).get();
//        nFile.setFileUpdatedAt(new Date());
//        nFile.setFileTitle(newFileName);
//        fileRepository.saveAndFlush(nFile);
    }

    public List<String> readFile(String filePath) {
        BufferedReader br = null;
        String content = "";

        List<String> res = new ArrayList<>();

        try {
            br = new BufferedReader(new FileReader(filePath));
            String line = null;

            while ((line = br.readLine()) != null) {
                content += line + "\n";
            }

        } catch (Exception e) {
            res.add("Failed");
            res.add(e.getMessage());
        }
//        } finally {
//            try {
//                if(br != null)
//                    br.close();
//            } catch (IOException e) {
//                res.add("Failed");
//                res.add(e.getMessage());
//            }
//        }
        res.add("Success");
        res.add(content);
        return res;
    }
}
