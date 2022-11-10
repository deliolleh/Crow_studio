package com.example.goldencrow.file.Controller;

import com.example.goldencrow.file.Service.FileService;
import com.example.goldencrow.file.Service.ProjectService;
import com.example.goldencrow.user.JwtService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.*;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

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

    @GetMapping("/{teamSeq}")
    public ResponseEntity<Map<List<String>,List<List<String>>>> pjtRead(@RequestHeader("Authorization") String jwt, @PathVariable Long teamSeq) {
        String baseUrl = "/home/ubuntu/crow_data/"+String.valueOf(teamSeq);
        File teamPjt = new File(baseUrl);
        String[] names = teamPjt.list();
        String rootName = names[0];
        String newUrl = baseUrl+ "/" + rootName;

        Map<List<String>,List<List<String>>> visit = new HashMap<>();
        List<List<String>> newValue = new ArrayList<>();
        List<String> root = new ArrayList<>();
        root.add(rootName);
        root.add(newUrl);
        visit.put(root,newValue);
        projectService.readDirectory(newUrl,rootName,visit);

        return new ResponseEntity<>(visit, HttpStatus.ACCEPTED);
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
