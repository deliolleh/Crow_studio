package com.example.goldencrow.file.Service;

import com.example.goldencrow.file.FileDto.FileCreateDto;
import com.example.goldencrow.file.FileEntity;
import com.example.goldencrow.file.Repository.FileRepository;
import com.example.goldencrow.team.entity.TeamEntity;
import com.example.goldencrow.team.repository.TeamRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.io.*;
import java.util.List;
import java.util.Optional;

import static java.lang.System.out;

@Service
public class ProjectService {

    @Autowired
    private FileRepository fileRepository;

    @Autowired
    private TeamRepository teamRepository;

    private FileService fileService;

    public String createDir(String path, String name){
        String pjt = path + "/" + name;
        File pjtDir = new File(pjt);
        if (pjtDir.mkdir()) {
            return pjt;
        };
        return "2";
    }

    /**
     * file db에 저장하는 함수
     */
    public boolean saveFileEntity(FileCreateDto fileCreateDto, TeamEntity team) {
        System.out.println("엔티티 만들기 전!");
        System.out.println(team.getTeamName() + fileCreateDto.getFilePath());
        FileEntity fileEntity = new FileEntity(fileCreateDto,team);

        System.out.println(fileCreateDto.getFilePath()+fileCreateDto.getFileTitle());
        fileRepository.saveAndFlush(fileEntity);
        System.out.println("파일 저장 제대로 됨!!");

        return true;
    }

    /**
     * 모든 경로 재귀적 탐색, 조회
     * type =1 은 저장
     * 2 는 조회
     */
    public void findFilesInDIr(String path, Long teamSeq) {
        File file = new File(path);
        File files[] = file.listFiles();
        Optional<TeamEntity> team = teamRepository.findByTeamSeq(teamSeq);

        TeamEntity thisTeam = team.get();

        String names[] = file.list();

        for (int i = 0; i < files.length; i++) {
            File dir = files[i];
            String name = names[i];
            String thisPath = dir.getPath();
            out.println(name);
            out.println(thisPath);
            FileCreateDto newFileCreateDto = new FileCreateDto(name,thisPath);
            out.println(newFileCreateDto);
            out.println(thisTeam);
            Boolean check = saveFileEntity(newFileCreateDto,thisTeam);
            out.println("함수 성공!!");
            if (dir.isDirectory()) {
                findFilesInDIr(dir.getPath(),teamSeq);
            }
        }
    }

    /**
     * 프로젝트 이니셜 파일 생성
     * type 1 = pure python
     * 2 = django
     * 3 = flask
     * 4 = fastapi
     */
    public String createProject(String path, Integer type, String projectName, Long teamSeq) {

        String fileTitle = projectName;

        if (type == 2) {

            ProcessBuilder djangoStarter = new ProcessBuilder();
            out.println("여기옴!!");
            out.println(fileTitle);
            djangoStarter.command("django-admin", "startproject", fileTitle);
            djangoStarter.directory(new File(path));

            try {
                out.println("여기도!!!!");
                djangoStarter.start();
            } catch (IOException e) {
                out.println(e.getMessage());
                return e.getMessage();
            }
            findFilesInDIr(path,teamSeq);
            return "1";
        } else if (type == 1) {
            String pjt = createDir(path,fileTitle);
            if (pjt.equals("2")) {
                findFilesInDIr(path,teamSeq);
                return "2";
            }

            File file = new File(pjt + "/" + fileTitle +".py");
            try {
                if(file.createNewFile()) {
                    findFilesInDIr(path,teamSeq);
                    return "1";
                } else {
                    return "2";
                }
            } catch (IOException e) {
                return e.getMessage();
            }
        } else if (type == 3) {
            String pjt = createDir(path,fileTitle);
            if (pjt.equals("2")) {
                return "2";
            }
            File file = new File(pjt + "/main.py");

            String content = "from flask import Flask\n\napp=Flask(" + projectName +")\n\n@app.route(\"/\")\ndef hello_world():\n\treturn \"<p>Hello, World</p>\"";
            try {
                FileWriter overWriteFile = new FileWriter(file, false);
                overWriteFile.write(content);
                overWriteFile.close();

            } catch (IOException e) {
                out.println("here!!!!!!!!!!!");
                return e.getMessage();
            }
            findFilesInDIr(path,teamSeq);
            return "1";
        } else if (type == 4) {
            String pjt = createDir(path,fileTitle);
            if (pjt.equals("2")) {
                return "2";
            }
            File file = new File(pjt + "/main.py");
            String content = "from fastapi import FastAPI\n\napp=FastAPI()\n\n@app.get(\"/\")\nasync def root():\n\treturn {\"message\" : \"Hello, World\"}";
            try {
                FileWriter overWriteFile = new FileWriter(file, false);
                overWriteFile.write(content);
                overWriteFile.close();
            } catch (IOException e) {
                return e.getMessage();
            }
            findFilesInDIr(path,teamSeq);
            return "1";
        }
        out.println("여기서 걸림");
        return "2";
    }

    public String deleteProject(List<Long> teamSeqs){
        ProcessBuilder deleter = new ProcessBuilder();
        for (Long seq : teamSeqs) {
            deleter.command("rm", "-r", String.valueOf(seq));
            deleter.directory(new File("/home/ubuntu/crow_data"));

            try {
                deleter.start();
            } catch (IOException e) {
                return "fail!";
            }
        }
        return "Success";
    }

    public String saveProject(){
        return "true";
    }
}
