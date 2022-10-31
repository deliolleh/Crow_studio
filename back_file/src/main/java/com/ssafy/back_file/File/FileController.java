package com.ssafy.back_file.File;


import com.ssafy.back_file.File.FileDto.FileCreateDto;
import com.ssafy.back_file.File.Service.FileService;
import com.ssafy.back_file.user.JwtService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.*;
import java.util.HashMap;

import static java.lang.System.out;

@RestController
@RequestMapping(value = "/api-file/projects")
public class FileController {

    private final FileService fileService;
    private final JwtService jwtService;
    private String baseUrl = "/home/ubuntu/crow_data/";
    public FileController(FileService fileService, JwtService jwtService) {
        this.fileService = fileService;
        this.jwtService = jwtService;
    }
    /**
     *
     * @param fileCreateDto
     * @return Message
     * 파일 생성 포스트 요청
     * 기본 경로를 잡아줄 지? 아니면 그냥 보내줄지?
     */

    @PostMapping("/{teamSeq}/files")
    public ResponseEntity<String> userFileCreate(@RequestHeader("jwt") String jwt,@PathVariable Long teamSeq, @RequestBody FileCreateDto fileCreateDto) {

        if (fileService.createFile(fileCreateDto, teamSeq)) {
            String newFilePath = fileCreateDto.getFilePath() + "/" + fileCreateDto.getFileTitle();
            out.println(newFilePath);
            return new ResponseEntity<>(newFilePath, HttpStatus.OK);
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
    /** 예외처리 안 되어 있음, DB에 저장 안 됨 */
    @PostMapping("/project")
    public ResponseEntity<String> projectCreate(@RequestParam Long type, @RequestBody HashMap<String, String> filePath) {
        String env = "cmd /c";
        String fileTitle = filePath.get("projectName");
        String baseUrl = "C:\\Users\\multicampus\\Desktop\\test";
        File file = new File(baseUrl + "\\" + fileTitle + ".py");
        if (type == 2) {
            String command = "django-admin startproject " + fileTitle;
            out.println(command);
            long start,end;
            try {
                Process p = Runtime.getRuntime().exec(String.format("cmd /c \"cd C:/Users/multicampus/Desktop/test && %s\"",command));

                BufferedReader input = new BufferedReader(new InputStreamReader(p.getInputStream()));
                String line = null;
                start = System.currentTimeMillis();
                while ((line = input.readLine()) != null) {out.println("Result : " + line);}
                    end = System.currentTimeMillis();
                    out.println("<br>Running Time : " + (end - start) / 1000f + "s.");



                //Process create = Runtime.getRuntime().exec(env + command);
                out.println(p);
                //System.out.println(create);
            } catch (IOException e) {
                out.println("명령어 안나갔음!! 망함!!!");
                return new ResponseEntity<>("Failed", HttpStatus.BAD_REQUEST);
            }
            return new ResponseEntity<>("Success", HttpStatus.OK);
        } else {

            try{
                if (!file.createNewFile()) {
                    return new ResponseEntity<>("Failed", HttpStatus.BAD_REQUEST);
                }
            } catch(IOException e) {
                return new ResponseEntity<>("Failed", HttpStatus.BAD_REQUEST);
            }
        }

        if (type == 3) {
            String content = "from flask import Flask\n\napp=Flask(" + filePath.get("projectName") +")\n\n@app.route(\"/\")\ndef hello_world():\n\treturn \"<p>Hello, World</p>\"";
            try {
                FileWriter overWriteFile = new FileWriter(file, false);
                overWriteFile.write(content);
                overWriteFile.close();

            } catch (IOException e) {
                out.println("here!!!!!!!!!!!");
                return new ResponseEntity<>("Failed", HttpStatus.BAD_REQUEST);
            }
            return new ResponseEntity<>("Success", HttpStatus.OK);
        } else if (type == 4) {
            String content = "from fastapi import FastAPI\n\napp=FastAPI()\n\n@app.get(\"/\")\nasync def root():\n\treturn {\"message\" : \"Hello, World\"}";
            try {
                FileWriter overWriteFile = new FileWriter(file, false);
                overWriteFile.write(content);
                overWriteFile.close();
            } catch (IOException e) {
                out.println("fastapi 여기서 터짐? 왜 터짐?");
                return new ResponseEntity<>("Failed", HttpStatus.BAD_REQUEST);
            }
        }
        return new ResponseEntity<>("Success", HttpStatus.OK);

    }

    @GetMapping("/{teamSeq}")
    public ResponseEntity<String> getDirectory(@RequestHeader("jwt") String jwt, @PathVariable Long teamSeq) {
        out.println(jwtService.JWTtoUserSeq(jwt));
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
