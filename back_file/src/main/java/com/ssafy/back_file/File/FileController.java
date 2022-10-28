package com.ssafy.back_file.File;


import com.ssafy.back_file.File.FileDto.FileCreateDto;
import com.ssafy.back_file.File.Service.FileService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.File;
import java.util.HashMap;

@RestController
@RequestMapping(value = "/api-file/projects")
public class FileController {

    private final FileService fileService;

    public FileController(FileService fileService) {
        this.fileService = fileService;
    }
    /**
     *
     * @param fileCreateDto
     * @return Message
     * 파일 생성 포스트 요청
     */

    @PostMapping("/{teamSeq}/files")
    public ResponseEntity<String> userFileCreate(@PathVariable Long teamSeq, @RequestBody FileCreateDto fileCreateDto) {
        if (fileService.createFile(fileCreateDto, teamSeq)) {
            return new ResponseEntity<>("파일 생성이 완료되었습니다.", HttpStatus.OK);
        } else {
            return new ResponseEntity<>("파일 생성에 실패했습니다.", HttpStatus.BAD_REQUEST);
        }
    }

    /**
     * @param filePath
     * 파일 삭제 요청
     */
    @DeleteMapping("/{teamSeq}/files")
    public ResponseEntity<String> userFileDelete(@PathVariable Long teamSeq, @RequestBody HashMap<String, String> filePath) {
        if (fileService.deleteFile(filePath.get("filePath"), teamSeq)) {
            return new ResponseEntity<>("파일 삭제를 성공했습니다.", HttpStatus.OK);
        } else {
            return new ResponseEntity<>("파일 삭제를 실패했습니다.", HttpStatus.BAD_REQUEST);
        }
    }

    /**
     * 파일 이름 변경 요청
     * @param
     * @return
     */
//    @PutMapping("/{teamSeq}/files")
//    public ResponseEntity<String> fileNameUpdate(@PathVariable Long teamSeq, @RequestBody HashMap<String, String> filePath) {
//        String newFilePath = filePath.get("filePath");
//        String renameFilePath = filePath.get("filePath") + "\\" + filePath.get("newFileName");
//        File targetFile = new File(newFilePath);
//        File reNameFile = new File(renameFilePath);
//
//        boolean result = targetFile.renameTo(reNameFile);
//
//        if (result) {
//            return new ResponseEntity<>("파일 이름 변경 성공!", HttpStatus.OK);
//        } else {
//            return new ResponseEntity<>("파일 이름 변경 실패!", HttpStatus.BAD_REQUEST);
//        }
//    }
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

    @PutMapping("/{teamSeq}/files")
    public ResponseEntity<String> saveFile(@PathVariable Long teamSeq,@RequestBody HashMap<String, String> fileContent){
        String content = fileContent.get("fileContent");
        String filePath = fileContent.get("filePath");

        boolean result = fileService.saveFile(filePath,content);
        boolean result2 = fileService.updateFileUpdatedAt(teamSeq,filePath);
        if (result && result2) {
            return new ResponseEntity<>("Success", HttpStatus.OK);
        } else {
            return new ResponseEntity<>("Failed", HttpStatus.BAD_REQUEST);
        }
    }


}
