package com.ssafy.back_file.File;


import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.persistence.EntityManager;
import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.NoSuchFileException;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.sql.Clob;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping(value = "/api/projects")
public class FileController {
    /**
     *
     * @param fileName
     * @param filePath
     * @return Message
     * 파일 생성 포스트 요청
     */
    @PostMapping("/{fileName}")
    public ResponseEntity<String> userFileCreate(@PathVariable String fileName, @RequestBody HashMap<String, String> filePath) {
        String newFilePath = filePath.get("filePath") + "\\" + fileName;

        File newFile = new File(newFilePath);
        System.out.println("HERE!!!!!!!!!!!!");
        try {
            if(newFile.createNewFile()) {
                System.out.println("File Create Success");
                return new ResponseEntity<>("Success", HttpStatus.OK);
            } else {
                System.out.println("Failed!!!!!!!!");
                return new ResponseEntity<>("Fail", HttpStatus.BAD_REQUEST);
            }
        } catch (IOException e) {
            e.printStackTrace();
            return new ResponseEntity<>("Fail", HttpStatus.BAD_REQUEST);
        }
    }

    /**
     * @param fileName - 파일 시퀀스로 바뀔 예정
     * @param filePath
     * 파일 삭제 요청
     */
    @DeleteMapping("/{fileName}")
    public ResponseEntity<String> userFileDelete(@PathVariable String fileName, @RequestBody HashMap<String, String> filePath) {

        String newFilePath = filePath.get("filePath") + "\\" + fileName;
        Path path = Paths.get(newFilePath);
        try {
            Files.delete(path);
        } catch (NoSuchFileException e) {
            return new ResponseEntity<>("파일이 존재하지 않습니다.",HttpStatus.BAD_REQUEST);
        } catch (IOException e) {
            return new ResponseEntity<>("Failed", HttpStatus.BAD_REQUEST);
        }
        return new ResponseEntity<>("성공적으로 삭제!", HttpStatus.OK);
    }

    /**
     * 파일 이름 변경 요청
     * @param fileName - 파일 시퀀스로 바뀔 예정
     * @return
     */
    @PutMapping("/{fileName}")
    public ResponseEntity<String> fileNameUpdate(@PathVariable String fileName, @RequestBody HashMap<String, String> filePath) {
        String newFilePath = filePath.get("filePath") + "\\" + fileName;
        String renameFilePath = filePath.get("filePath") + "\\" + filePath.get("newFileName");
        File targetFile = new File(newFilePath);
        File reNameFile = new File(renameFilePath);

        boolean result = targetFile.renameTo(reNameFile);

        if (result) {
            return new ResponseEntity<>("파일 이름 변경 성공!", HttpStatus.OK);
        } else {
            return new ResponseEntity<>("파일 이름 변경 실패!", HttpStatus.BAD_REQUEST);
        }
    }
    @PostMapping("/project")
    public ResponseEntity<String> projectCreate(@RequestParam Long type, @RequestBody HashMap<String, String> filePath) {
        String env = "cmd /c";
        System.out.println(filePath);
        if (type <= 4 && 1 <= type && filePath.get("filePath") != null && filePath.get("projectName") != null) {
            return new ResponseEntity<>("Success", HttpStatus.OK);
        } else {
            return new ResponseEntity<>("Failed", HttpStatus.BAD_REQUEST);
        }
    }

    @GetMapping("/{teamSeq}")
    public ResponseEntity<String> getDirectory(@PathVariable Long teamSeq) {
        return new ResponseEntity<>("Success", HttpStatus.OK);
    }

    @PostMapping("/save/{fileSeq}")
    public ResponseEntity<String> saveFile(@PathVariable Long fileSeq,@RequestBody HashMap<String, String> fileContent){
        String content = fileContent.get("fileContent");
        String fileName = fileContent.get("fileName");
        if (content == null) {
            return new ResponseEntity<>("Failed", HttpStatus.BAD_REQUEST);
        } else if (fileName == null) {
            return new ResponseEntity<>("Failed", HttpStatus.BAD_REQUEST);
        } else {
            return new ResponseEntity<>("Success", HttpStatus.OK);
        }
    }


}
