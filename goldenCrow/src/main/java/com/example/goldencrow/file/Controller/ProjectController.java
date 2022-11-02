package com.example.goldencrow.file.Controller;

import com.example.goldencrow.file.Service.FileService;
import com.example.goldencrow.file.Service.ProjectService;
import com.example.goldencrow.user.JwtService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.File;
import java.io.IOException;
import java.util.HashMap;

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

    public static void showFilesInDIr (String path) {
        File file = new File(path);
        File files[] = file.listFiles();
        System.out.println(files);
        String names[] = file.list();

        for (int i = 0; i < files.length; i++) {
            File dir = files[i];
            String name = names[i];
            if (file.isDirectory()) {
                showFilesInDIr(dir.getPath());

            } else {
                System.out.println("file: " + file);
                System.out.println(name);
            }
        }
    }

    @PostMapping("/{teamSeq}")
    public ResponseEntity<String> teamProjectCreate(@RequestHeader("jwt") String jwt, @PathVariable Long teamSeq,@RequestParam Integer type, @RequestBody HashMap<String,String> projectName){
        String pjt = projectName.get("projectName");
        if (projectService.createProject(teamSeq,type,pjt) == "1") {
            return new ResponseEntity<>("프로젝트 생성 성공했습니다.", HttpStatus.OK);
        } else if (projectService.createProject(teamSeq,type,pjt) == "2") {
            return new ResponseEntity<>("이미 동일한 프로젝트가 존재합니다.", HttpStatus.BAD_REQUEST);
        } else {
            return new ResponseEntity<>(projectService.createProject(teamSeq, type, pjt), HttpStatus.BAD_REQUEST);
        }
    }

    @GetMapping("/")
    public ResponseEntity<String> pjtRead(@RequestHeader("jwt") String jwt) {
        String baseUrl = "/home/ubuntu/crow_data/999";
        showFilesInDIr(baseUrl);

        return new ResponseEntity<>("1", HttpStatus.ACCEPTED);
    }


    @GetMapping("/test")
    public ResponseEntity<String> deletePjt() {
        ProcessBuilder builder = new ProcessBuilder();
        try {
            builder.command("sh", "-c", "django-admin startproject helloWorld");
            builder.directory(new File("/home/ubuntu/crow_data/15"));
        } catch (Exception e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }

        try {
            builder.start();
        } catch (IOException e) { return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST); }

        return new ResponseEntity<>("Why?", HttpStatus.OK);
    }
}
