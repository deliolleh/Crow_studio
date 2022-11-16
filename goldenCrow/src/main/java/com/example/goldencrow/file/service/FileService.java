package com.example.goldencrow.file.service;


import com.example.goldencrow.file.FileEntity;
import com.example.goldencrow.file.FileRepository;
import com.example.goldencrow.file.dto.FileCreateDto;
import com.example.goldencrow.file.dto.FileCreateRequestDto;

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

@Service
public class FileService {

    @Autowired
    private FileRepository fileRepository;

    private final String Success = "Success";


    /** 파일 생성 로직
     * 파일이 성공적으로 생성되면 true
     * 아니면 false 반환*/
    public boolean createFile(FileCreateRequestDto fileCreateRequestDto, Integer type, Long teamSeq) {
        String newFilePath = fileCreateRequestDto.getFilePath() + "/"+ fileCreateRequestDto.getFileTitle();
        String check = makeNewFile(newFilePath,type);

        if (check.equals(Success)) {
            FileCreateDto newFileCreateDto = new FileCreateDto(fileCreateRequestDto.getFileTitle(),newFilePath,teamSeq);
            insertFile(newFileCreateDto);
            return true;
        }
        
        return false;
    }

    /**
     * 우분투 서버에 파일을 생성하는 로직
     * 성공한다면 디비 저장 함수를 부를 예정
     * @param filePath
     * @param type
     * @return
     */
    public String makeNewFile(String filePath, Integer type) {
        File newFile = new File(filePath);
        try{
            if (type == 2){
                if(newFile.createNewFile()) {
                    //fileRepository.saveAndFlush(fileEntity);
                    return Success;
                } else {
                    return "파일 생성에 실패했습니다.";
                }
            } else {
                if (newFile.mkdir()) {
                    //fileRepository.saveAndFlush(fileEntity);
                    return Success;
                } else {
                    return "폴더 생성에 실패했습니다.";
                }
            }
        } catch (IOException e) {
            return e.getMessage();
        }
    }

    /**
     * DB에 파일을 insert해주는 로직
     * @param fileCreateDto
     */
    public void insertFile(FileCreateDto fileCreateDto) {
        FileEntity fileEntity = new FileEntity(fileCreateDto);
        fileRepository.insert(fileEntity);
    }

    /** 파일 삭제  */
    public boolean deleteFile(String filePath,Integer type, Long teamSeq) {
        Optional<FileEntity> file = fileRepository.findFileEntityByTeamSeqAndFilePath(teamSeq, filePath);

        // 만약 이게 DB에 없는 파일 경로나 그렇다면 실패!
        if (!file.isPresent()) {
            return false;
        }
        String check = serverFileDelete(type,filePath);
        if (!check.equals(Success)) {
            return false;
        }
        fileRepository.delete(file.get());
        return true;
    }

    /**
     * 서버 파일 삭제
     * @param type
     * @param filePath
     * @return
     */
    public String serverFileDelete(Integer type, String filePath) {
        Path path = Paths.get(filePath);
        // 디렉토리라면
        if (type == 1) {
            ProcessBuilder pb = new ProcessBuilder();
            pb.command("rm","-r",filePath);

            try{
                pb.start();
            } catch (IOException e) {
                return e.getMessage();
            }
            // 파일 이라면
        } else {
            try {
                Files.delete(path);
            } catch (NoSuchFileException e) {
                return e.getMessage();
            } catch (IOException ioe) {
                return ioe.getMessage();
            }
        }
        return Success;
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

        return Success;
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
    public boolean updateFileName(String filePath, String newFileName,String oldFileName, Long teamSeq) {
        String newFilePath = filePath;
        String renameFilePath = filePath.replace(oldFileName, newFileName);
        File targetFile = new File(newFilePath);
        File reNameFile = new File(renameFilePath);

        Optional<FileEntity> file = fileRepository.findFileEntityByTeamSeqAndFilePath(teamSeq, filePath);

        if (!file.isPresent()) {
            return false;
        }

        FileEntity nameFile = file.get();
        nameFile.setFileTitle(newFileName);
        fileRepository.save(nameFile);
        return targetFile.renameTo(reNameFile);
    }

    public List<String> readFile(String filePath) {
        String content = "";

        List<String> res = new ArrayList<>();

        try (BufferedReader br = new BufferedReader(new FileReader(filePath))) {

            String line = null;

            while ((line = br.readLine()) != null) {
                content += line + "\n";
            }

        } catch (Exception e) {
            res.add("Failed");
            res.add(e.getMessage());
        }

        res.add("Success");
        res.add(content);
        return res;
    }
}
