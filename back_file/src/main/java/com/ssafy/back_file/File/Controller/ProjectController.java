package com.ssafy.back_file.File.Controller;

import com.ssafy.back_file.File.Service.FileService;
import com.ssafy.back_file.File.Service.ProjectService;
import com.ssafy.back_file.user.JwtService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.File;

import java.io.IOException;

import java.util.HashMap;

@RestController
@RequestMapping(value = "/api-file/projects")
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
        String baseUrl = "C:\\Users\\multicampus\\Desktop\\test";
        showFilesInDIr(baseUrl);

        return new ResponseEntity<>("1", HttpStatus.ACCEPTED);
    }
    @DeleteMapping("/{teamSeq}")
    public ResponseEntity<String> deletePjt(@PathVariable Long teamSeq) {

        String cmd = "/bin/sh -c cd /home/ubuntu/crow_data && sudo rm -r 15";




        try {
            Runtime.getRuntime().exec("bash -c cd /home/ubuntu/crow_data && touch maind.py");
            Runtime.getRuntime().exec("bash -c cd /home/ubuntu/crow_data && sudo touch maine.py");

        } catch (IOException e) { return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST); }
        try {
            Process p = Runtime.getRuntime().exec("./bin/sh -c cd /home/123asd");
            Process a = Runtime.getRuntime().exec("sh -c sudo cd /home/사람살려사람");
        } catch (IOException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }

        return new ResponseEntity<>("Why?", HttpStatus.OK);
    }
}
