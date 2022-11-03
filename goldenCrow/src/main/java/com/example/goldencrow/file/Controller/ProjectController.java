package com.example.goldencrow.file.Controller;

import com.example.goldencrow.file.Service.FileService;
import com.example.goldencrow.file.Service.ProjectService;
import com.example.goldencrow.user.JwtService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.*;
import java.util.HashMap;
import java.util.List;

import static java.lang.System.out;

@RestController
@RequestMapping(value = "/api/projects")
public class ProjectController {
    private final JwtService jwtService;

    private final FileService fileService;

    private final ProjectService projectService;

    private String baseUrl = "/home/ubuntu/crow_data/";

    public ProjectController(FileService fileService, JwtService jwtService, ProjectService projectService) {
        this.fileService = fileService;
        this.jwtService = jwtService;
        this.projectService = projectService;
    }

    public static void showFilesInDIr(String path) {
        File file = new File(path);
        File files[] = file.listFiles();
        System.out.println(files.length);
        out.println("여기야 여기!!!!!");
        out.println(files[0]);
        String names[] = file.list();

        for (int i = 0; i < files.length; i++) {
            File dir = files[i];
            String name = names[i];
            if (dir.isDirectory()) {
                showFilesInDIr(dir.getPath());

            } else {
                System.out.println("file: " + dir);
                System.out.println(name);
            }
        }
    }

    @PostMapping("/{teamSeq}")
    public ResponseEntity<String> teamProjectCreate(@RequestHeader("Authorization") String jwt, @PathVariable Long teamSeq, @RequestParam Integer type, @RequestBody HashMap<String, String> projectName) {
        String pjt = projectName.get("projectName");
        String baseUrl = "/home/ubuntu/crow_data";
        String newBaseUrl = baseUrl + "/" + String.valueOf(teamSeq)+"/";
        File newDir = new File(newBaseUrl);

        if (!newDir.mkdirs()) {
            return new ResponseEntity<>("이미 프로젝트가 존재합니다.", HttpStatus.NOT_ACCEPTABLE);
        }
        String check = projectService.createProject(newBaseUrl, type, pjt);
        if (check.equals("1")) {
            return new ResponseEntity<>("프로젝트 생성 성공했습니다.", HttpStatus.OK);
        } else if (check.equals("2")) {
            return new ResponseEntity<>("프로젝트 생성에 실패했습니다.", HttpStatus.BAD_REQUEST);
        } else {
            return new ResponseEntity<>(check, HttpStatus.BAD_REQUEST);
        }
    }

    @GetMapping("/")
    public ResponseEntity<String> pjtRead(@RequestHeader("Authorization") String jwt) {
        String baseUrl = "/home/ubuntu/crow_data/999/";
        showFilesInDIr(baseUrl);

        return new ResponseEntity<>("1", HttpStatus.ACCEPTED);
    }


    @PostMapping("/projectDeleter")
    public ResponseEntity<String> deletePjt(@RequestHeader("Authorization") String jwt, @RequestBody HashMap<String,List<Long>> teamSeqs) {
        String check = projectService.deleteProject(teamSeqs.get("teamSeqs"));
        if (check.equals("fail!")) {
            return new ResponseEntity<>(check,HttpStatus.BAD_REQUEST);
        }
        return new ResponseEntity<>("성공!",HttpStatus.OK);
    }
}
