package com.example.goldencrow.file.Service;

import com.example.goldencrow.file.Repository.FileRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.io.*;
import java.util.List;

import static java.lang.System.out;

@Service
public class ProjectService {

    @Autowired
    private FileRepository fileRepository;
    public String createDir(String path, String name){
        String pjt = path + "/" + name;
        File pjtDir = new File(pjt);
        if (pjtDir.mkdir()) {
            return pjt;
        };
        return "2";
    }

    /**
     * 프로젝트 이니셜 파일 생성
     * type 1 = pure python
     * 2 = django
     * 3 = flask
     * 4 = fastapi
     */
    public String createProject(String path, Integer type, String projectName) {

        String fileTitle = projectName;


        if (type == 2) {

            ProcessBuilder djangoStarter = new ProcessBuilder();
            djangoStarter.command("django-admin", "startproject", fileTitle);

            djangoStarter.directory(new File(path));
            try {
                djangoStarter.start();
            } catch (IOException e) {
                out.println(e.getMessage());
                return e.getMessage();
            }
            return "1";
        } else if (type == 1) {
            String pjt = createDir(path,fileTitle);
            if (pjt.equals("2")) {
                return "2";
            }

            File file = new File(pjt + "/" + fileTitle +".py");
            try {
                if(file.createNewFile()) {
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
