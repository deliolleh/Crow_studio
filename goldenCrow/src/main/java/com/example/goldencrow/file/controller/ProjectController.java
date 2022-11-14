package com.example.goldencrow.file.controller;


import com.example.goldencrow.file.service.ProjectService;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


import java.util.*;



@RestController
@RequestMapping(value = "/api/projects")
public class ProjectController {

    private final ProjectService projectService;

    public ProjectController(ProjectService projectService) {
        this.projectService = projectService;
    }



    @PostMapping("/{teamSeq}")
    public ResponseEntity<String> teamProjectCreate(@RequestHeader("Authorization") String jwt, @PathVariable Long teamSeq, @RequestParam Integer type, @RequestBody HashMap<String, String> projectName) {
        String pjt = projectName.get("projectName");
        String baseUrl = "/home/ubuntu/crow_data";

        String check = projectService.createProject(baseUrl, type, pjt, teamSeq);
        if (check.equals("1")) {
            return new ResponseEntity<>("프로젝트 생성 성공했습니다.", HttpStatus.OK);
        } else if (check.equals("2")) {
            return new ResponseEntity<>("프로젝트 생성에 실패했습니다.", HttpStatus.BAD_REQUEST);
        } else {
            return new ResponseEntity<>(check, HttpStatus.BAD_REQUEST);
        }
    }

    @PostMapping("/directories")
    public ResponseEntity<Map<String,List<Map<String,String>>>> pjtRead(@RequestHeader("Authorization") String jwt, @RequestBody HashMap<String,String> rootFile) {
        String rootPath = rootFile.get("rootPath");
        String rootName = rootFile.get("rootName");
        Map<String,List<Map<String,String>>> directory;
        directory = projectService.readDirectory(rootPath,rootName);

        return new ResponseEntity<>(directory, HttpStatus.ACCEPTED);
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
