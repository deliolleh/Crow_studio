package com.example.goldencrow.file.controller;

import com.example.goldencrow.file.service.ProjectService;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.File;
import java.util.*;

import static com.example.goldencrow.common.Constants.*;

/**
 * 프로젝트 관련 Controller
 *
 * @url /api/projects
 */
@RestController
@RequestMapping(value = "/api/projects")
public class ProjectController {

    private final ProjectService projectService;

    /**
     * ProjectController 생성자
     *
     * @param projectService project 관련 로직을 처리하는 Service
     */
    public ProjectController(ProjectService projectService) {
        this.projectService = projectService;
    }

    /**
     * 프로젝트 생성 API
     *
     * @param teamSeq 프로젝트를 생성할 팀의 Sequence
     * @param type    생성할 프로젝트의 종류 (1: pure Python, 2: Django, 3: Flask, 4: FastAPI)
     * @param req     "projectName"을 key로 가지는 Map<String, String>
     * @return
     * @status
     */
    @PostMapping("/{teamSeq}")
    public ResponseEntity<Map<String, String>> teamProjectCreate(@PathVariable Long teamSeq,
                                                    @RequestParam int type,
                                                    @RequestBody Map<String, String> req) {
        String pjt = req.get("projectName");
//        String baseUrl = "/home/ubuntu/crow_data";

        Map<String, String> res = projectService.createProjectService(BASE_URL, type, pjt, teamSeq);
        switch (res.get("result")) {
            case SUCCESS:
                return new ResponseEntity<>(res, HttpStatus.OK);
            case DUPLICATE:
                return new ResponseEntity<>(res, HttpStatus.CONFLICT);
            default:
                return new ResponseEntity<>(res, HttpStatus.BAD_REQUEST);
        }
    }

    /**
     * 프로젝트 디렉토리 조회 API
     *
     * @param teamSeq 조회하려는 프로젝트의 팀 Sequence
     * @return 디렉토리 구조를 반환
     * @status 200, 400, 401
     */
    @GetMapping("/directories/{teamSeq}")
    public ResponseEntity<Map<Object, Object>> pjtReadGet(@PathVariable Long teamSeq) {
        String pjtPath = BASE_URL + teamSeq;
        File teamPjt = new File(pjtPath);
        File[] files = teamPjt.listFiles();

        Map<Object, Object> res = new HashMap<>();
        if (files == null) {
            res.put("result", BAD_REQ);
            return new ResponseEntity<>(res, HttpStatus.BAD_REQUEST);
        } else if (files.length == 0) {
            res.put("result", BAD_REQ);
            return new ResponseEntity<>(res, HttpStatus.BAD_REQUEST);
        }

        String rootPath = files[0].getPath();
        String rootName = files[0].getName();
        rootPath = rootPath.replace(BASE_URL, "");
        res = projectService.readDirectoryService(rootPath, rootName, res);
        return new ResponseEntity<>(res, HttpStatus.OK);
    }
}
