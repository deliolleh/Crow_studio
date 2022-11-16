package com.example.goldencrow.file.controller;


import com.example.goldencrow.file.fileDto.FileCreateDto;
import com.example.goldencrow.file.fileDto.FileCreateRequestDto;
import com.example.goldencrow.file.service.FileService;
import com.example.goldencrow.user.service.JwtService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;


@RestController
@RequestMapping(value = "/api/files")
public class FileController {
    private final FileService fileService;
    private final JwtService jwtService;

    private String stringPath = "filePath";

    public FileController(FileService fileService, JwtService jwtService) {
        this.fileService = fileService;
        this.jwtService = jwtService;
    }

    /**
     *
     * @param fileCreateRequestDto
     * @return Message
     * 파일 생성 포스트 요청
     * 기본 경로를 잡아줄 지? 아니면 그냥 보내줄지?
     */

    @PostMapping("/{teamSeq}")

    public ResponseEntity<String> userFileCreate(@RequestHeader("Authorization") String jwt,@RequestParam Integer type,@PathVariable Long teamSeq, @RequestBody FileCreateRequestDto fileCreateRequestDto) {
        boolean check = fileService.createFile(fileCreateRequestDto, type, teamSeq);
        if (check) {
            String newFilePath = fileCreateRequestDto.getFilePath()  + "/" + fileCreateRequestDto.getFileTitle();
            return new ResponseEntity<>(newFilePath, HttpStatus.OK);
        } else {
            return new ResponseEntity<>("파일 생성에 실패했습니다.", HttpStatus.BAD_REQUEST);
        }
    }

    /**
     * @param teamSeq 파일 삭제 요청
     */
    @DeleteMapping("/{teamSeq}")
    public ResponseEntity<String> userFileDelete(@RequestHeader("Authorization") String jwt, @PathVariable Long teamSeq, @RequestParam Integer type, @RequestBody HashMap<String, String> filePath) {
        boolean check = fileService.deleteFile(filePath.get(stringPath), type, teamSeq);
        if (check) {
            return new ResponseEntity<>("파일 삭제를 성공했습니다.", HttpStatus.OK);
        } else {
            return new ResponseEntity<>("파일 삭제를 실패했습니다.", HttpStatus.BAD_REQUEST);
        }
    }

    /**
     * 파일 이름 변경 요청
     * @param teamSeq
     * @param filePath
     * @return
     */
    @PutMapping("/{teamSeq}/file-title")
    public ResponseEntity<String> fileNameUpdate(@PathVariable Long teamSeq, @RequestBody HashMap<String, String> filePath) {
        String path = filePath.get(stringPath);
        String title = filePath.get("fileTitle");
        String oldFileName = filePath.get("oldFileName");

        boolean result = fileService.updateFileName(path,title,oldFileName, teamSeq);

        if (result) {
            return new ResponseEntity<>("파일 이름 변경 성공!", HttpStatus.CREATED);
        } else {
            return new ResponseEntity<>("파일 이름 변경 실패!", HttpStatus.SERVICE_UNAVAILABLE);
        }
    }


    @GetMapping("/{teamSeq}")
    public ResponseEntity<String> getDirectory(@RequestHeader("Authorization") String jwt, @PathVariable Long teamSeq) {
        Long result = jwtService.JWTtoUserSeq(jwt);
        return new ResponseEntity<>(String.valueOf(result), HttpStatus.OK);
    }

    @PutMapping("/{teamSeq}/files")
    public ResponseEntity<String> saveFile(@RequestHeader("Authorization") String jwt, @PathVariable Long teamSeq, @RequestBody HashMap<String, String> fileContent) {
        String content = fileContent.get("fileContent");
        String filePath = fileContent.get(stringPath);
        String result = fileService.saveFile(filePath, content);

        if (result.equals("Success")) {
            return new ResponseEntity<>("Success", HttpStatus.OK);
        } else {
            return new ResponseEntity<>(result, HttpStatus.BAD_REQUEST);
        }

        // boolean result2 = fileService.updateFileUpdatedAt(teamSeq,filePath);
    }

    @PostMapping("/files")
    public ResponseEntity<String> readFile(@RequestHeader("Authorization") String jwt, @RequestBody HashMap<String, String> path) {
        List<String> content = fileService.readFile(path.get(stringPath));
        if (content.get(0).equals("Success")) {
            return new ResponseEntity<>(content.get(1), HttpStatus.OK);
        } else {
            return new ResponseEntity<>(content.get(1), HttpStatus.BAD_REQUEST);
        }

    }


}
