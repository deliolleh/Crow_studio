package com.ssafy.back_file.File.Controller;

import com.ssafy.back_file.File.Service.FileService;
import com.ssafy.back_file.File.Service.ProjectService;
import com.ssafy.back_file.user.JwtService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.File;

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
    public ResponseEntity<String> teamProjectCreate(@RequestHeader("jwt") String jwt, @PathVariable Long teamSeq,@RequestParam Integer type, @RequestBody String projectName){
        if (projectService.createProject(teamSeq,type,projectName) == "1") {
            return new ResponseEntity<>("프로젝트 생성 성공했습니다.", HttpStatus.OK);
        } else if (projectService.createProject(teamSeq,type,projectName) == "2") {
            return new ResponseEntity<>("이미 동일한 프로젝트가 존재합니다.", HttpStatus.BAD_REQUEST);
        } else {
            return new ResponseEntity<>(projectService.createProject(teamSeq, type, projectName), HttpStatus.BAD_REQUEST);
        }
    }

    @GetMapping("/")
    public ResponseEntity<String> pjtRead(@RequestHeader("jwt") String jwt) {
        String baseUrl = "C:\\Users\\multicampus\\Desktop\\test";
        showFilesInDIr(baseUrl);

        return new ResponseEntity<>("1", HttpStatus.ACCEPTED);
    }
}
