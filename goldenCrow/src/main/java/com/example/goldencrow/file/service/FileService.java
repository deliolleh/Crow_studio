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
import java.util.*;

import java.util.List;
import java.util.Optional;

import static com.example.goldencrow.common.Constants.*;

/**
 * file 관련 로직을 처리하는 Service
 */
@Service
public class FileService {

    @Autowired
    private FileRepository fileRepository;

//    private final String Success = "Success";
//
//    private final String baseUrl = "/home/ubuntu/crow_data/";

    /**
     * 파일(폴더) 생성 내부 로직
     *
     * @param teamSeq              파일(폴더)를 생성할 팀의 sequence
     * @param type                 생성할 문서의 종류 (1 : 폴더, 2 : 파일)
     * @param fileCreateRequestDto "fileTitle", "filePath"를 key로 가지는 Dto
     * @return 파일(폴더) 생성 성공 시 파일 경로 반환, 성패에 대한 result 반환
     */
    public Map<String, String> createFileService(Long teamSeq, int type, FileCreateRequestDto fileCreateRequestDto) {
        Map<String, String> serviceRes = new HashMap<>();

        // 생성할 파일 혹은 폴더의 경로
        String newFilePath = BASE_URL + fileCreateRequestDto.getFilePath() + "/" + fileCreateRequestDto.getFileTitle();

        // 경로와 타입으로 file 생성 로직 수행
        String makeNewFileRes = makeNewFileService(newFilePath, type);
        if (makeNewFileRes.equals(SUCCESS)) {
            FileCreateDto newFileCreateDto = new FileCreateDto(fileCreateRequestDto.getFileTitle(), newFilePath, teamSeq);
            insertFileService(newFileCreateDto);
            serviceRes.put("result", SUCCESS);
            serviceRes.put("filePath", newFilePath);
            return serviceRes;
        }
        serviceRes.put("result", UNKNOWN);
        return serviceRes;
    }

    /**
     * Ubuntu에 파일을 생성하는 내부 로직
     *
     * @param filePath 파일을 생성할 경로
     * @param type      생성할 문서의 종류 (1 : 폴더, 2 : 파일)
     * @return 성패에 따른 result string 반환
     */
    public String makeNewFileService(String filePath, int type) {
        File newFile = new File(filePath);
        try {
            if (type == 1) {
                if (newFile.mkdir()) {
                    return SUCCESS;
                } else {
                    return DUPLICATE;
                }
            } else {
                if (newFile.createNewFile()) {
                    return SUCCESS;
                } else {
                    return DUPLICATE;
                }
            }
        } catch (IOException e) {
            return UNKNOWN;
        }
    }

    /**
     * MongoDB에 파일을 insert하는 내부 로직
     *
     * @param fileCreateDto
     */
    public void insertFileService(FileCreateDto fileCreateDto) {
        FileEntity fileEntity = new FileEntity(fileCreateDto);
        fileRepository.insert(fileEntity);
    }

    /**
     * 파일 삭제
     */


    public Map<String, String> deleteFile(String filePath, Integer type, Long teamSeq) {
        Optional<FileEntity> file = fileRepository.findFileEntityByTeamSeqAndFilePath(teamSeq, filePath);
        Map<String, String> serviceRes = new HashMap<>();

        // 만약 이게 DB에 없는 파일 경로나 그렇다면 실패!
        if (!file.isPresent()) {
            serviceRes.put("result", NO_SUCH);
            return serviceRes;
        }
        String check = serverFileDelete(type, filePath);
        if (!check.equals(SUCCESS)) {
            serviceRes.put("result", check);
            return serviceRes;
        }
        fileRepository.delete(file.get());
        serviceRes.put("result", SUCCESS);
        return serviceRes;
    }

    /**
     * 서버 파일 삭제
     *
     * @param type
     * @param filePath
     * @return
     */
    public String serverFileDelete(Integer type, String filePath) {
        Path path = Paths.get(filePath);
        // 디렉토리라면
        if (type == 1) {
            ProcessBuilder pb = new ProcessBuilder();
            pb.command("rm", "-r", filePath);

            try {
                pb.start();
            } catch (IOException e) {
                return e.getMessage();
            }
            // 파일 이라면
        } else {
            try {
                Files.delete(path);
            } catch (NoSuchFileException e) {
                return NO_SUCH;
            } catch (IOException ioe) {
                return UNKNOWN;
            }
        }
        return SUCCESS;
    }

    /**
     * 파일 저장 기존 파일을 삭제하고 새로운 파일을 덮어씌우는 형태
     *
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

    /**
     * 파일 updatedat 업데이트 함수 안씁니다.
     *
     * @param filePath
     * @return
     */
    public boolean updateFileName(String filePath, String newFileName, String oldFileName, Long teamSeq) {
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
