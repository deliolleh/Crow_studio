package com.example.goldencrow.file.controller;

import com.example.goldencrow.file.dto.FileCreateRequestDto;
import com.example.goldencrow.file.service.FileService;
import com.example.goldencrow.user.service.JwtService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static com.example.goldencrow.common.Constants.*;

/**
 * 파일을 관리하는 Controller
 *
 * @url /api/files
 */
@RestController
@RequestMapping(value = "/api/files")
public class FileController {
    private final FileService fileService;
    private final JwtService jwtService;

    private String stringPath = "filePath";

//    private final String basePath = "/home/ubuntu/crow_data/";

    /**
     * FileController 생성자
     *
     * @param fileService file 관련 로직을 처리하는 Service
     * @param jwtService  access token 관련 로직을 처리하는 Service
     */
    public FileController(FileService fileService, JwtService jwtService) {
        this.fileService = fileService;
        this.jwtService = jwtService;
    }

    /**
     * 파일(폴더) 생성 API
     *
     * @param type                 생성할 문서의 종류 (1 : 폴더, 2 : 파일)
     * @param teamSeq              파일(폴더)를 생성할 팀의 sequence
     * @param fileCreateRequestDto "fileTitle", "filePath"를 key로 가지는 Dto
     * @return 파일(폴더) 생성 성공 시 파일 경로 반환, 성패에 대한 result 반환
     * @status 200, 400, 401
     */
    @PostMapping("/{teamSeq}")
    public ResponseEntity<Map<String, String>> userFileCreatePost(@RequestParam int type,
                                                                  @PathVariable Long teamSeq,
                                                                  @RequestBody FileCreateRequestDto fileCreateRequestDto) {
        Map<String, String> res = fileService.createFileService(type, teamSeq, fileCreateRequestDto);
        if (res.get("result").equals(SUCCESS)) {
            return new ResponseEntity<>(res, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(res, HttpStatus.BAD_REQUEST);
        }
    }

    /**
     * @param teamSeq 파일 삭제 요청
     */
    @DeleteMapping("/{teamSeq}")

    public ResponseEntity<Map<String, String>> userFileDelete(@RequestHeader("Authorization") String jwt, @PathVariable Long teamSeq, @RequestParam Integer type, @RequestBody HashMap<String, String> filePath) {
        Map<String, String> res = fileService.deleteFile(basePath + filePath.get(stringPath), type, teamSeq);
        if (res.get("result").equals(SUCCESS)) {
            return new ResponseEntity<>(res, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(res, HttpStatus.BAD_REQUEST);
        }
    }

    /**
     * 파일 이름 변경 요청
     *
     * @param teamSeq
     * @param filePath
     * @return
     */
    @PutMapping("/{teamSeq}/file-title")
    public ResponseEntity<String> fileNameUpdate(@PathVariable Long teamSeq, @RequestBody HashMap<String, String> filePath) {
        String path = filePath.get(stringPath);
        String title = filePath.get("fileTitle");
        String oldFileName = filePath.get("oldFileName");

        boolean result = fileService.updateFileName(basePath + path, title, oldFileName, teamSeq);

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
        String result = fileService.saveFile(basePath + filePath, content);

        if (result.equals("Success")) {
            return new ResponseEntity<>("Success", HttpStatus.OK);
        } else {
            return new ResponseEntity<>(result, HttpStatus.BAD_REQUEST);
        }

        // boolean result2 = fileService.updateFileUpdatedAt(teamSeq,filePath);
    }

    @PostMapping("/files")
    public ResponseEntity<String> readFile(@RequestHeader("Authorization") String jwt, @RequestBody HashMap<String, String> path) {
        List<String> content = fileService.readFile(basePath + path.get(stringPath));
        if (content.get(0).equals("Success")) {
            return new ResponseEntity<>(content.get(1), HttpStatus.OK);
        } else {
            return new ResponseEntity<>(content.get(1), HttpStatus.BAD_REQUEST);
        }

    }


}
