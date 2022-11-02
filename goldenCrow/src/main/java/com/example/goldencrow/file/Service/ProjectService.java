package com.example.goldencrow.file.Service;

import com.example.goldencrow.file.Repository.FileRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.File;
import java.io.FileWriter;
import java.io.IOException;

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
    public String createProject(Long teamSeq, Integer type, String projectName) {

        String fileTitle = projectName;
        String baseUrl = "/home/ubuntu/crow_data";
        String newBaseUrl = baseUrl + "/" + String.valueOf(teamSeq);
        File newDir = new File(newBaseUrl);

        if (!newDir.mkdirs()) {
            return "2";
        }

        if (type == 2) {
            ProcessBuilder djangoStarter = new ProcessBuilder();
            djangoStarter.command("sh", "-c", String.format("django-admin startproject %s",fileTitle));
            djangoStarter.directory(newDir);
            try {
                djangoStarter.start();
            } catch (IOException e) {
                return e.getMessage();
            }
            return "1";
        } else if (type == 1) {
            String pjt = createDir(newBaseUrl,fileTitle);
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
            String pjt = createDir(newBaseUrl,fileTitle);
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
            String pjt = createDir(newBaseUrl,fileTitle);
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
        return "2";
    }

    public String saveProject(){
        return "true";
    }
}
