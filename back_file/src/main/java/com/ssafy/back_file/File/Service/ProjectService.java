package com.ssafy.back_file.File.Service;

import com.ssafy.back_file.File.Repository.FileRepository;
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

    public String createProject(Long teamSeq, Integer type, String projectName) {
        String env = "cmd /c";
        String fileTitle = projectName;
        String baseUrl = "/home/ubuntu/crow_data";
        String newBaseUrl = baseUrl + "/" + String.valueOf(teamSeq);
        File newDir = new File(newBaseUrl);

        if (!newDir.mkdirs()) {
            return "2";
        }

        if (type == 2) {
            String command = "django-admin startproject " + fileTitle;
            try {
                Process p = Runtime.getRuntime().exec(String.format("cmd /c \"cd %s && %s\"",newBaseUrl,command));
            } catch (IOException e) {
                return e.getMessage();
            }
            return "1";
        } else if (type == 1) {
            File file = new File(newBaseUrl + "/" + fileTitle +".py");
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
            File file = new File(newBaseUrl + "/main.py");
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
            File file = new File(newBaseUrl + "/main.py");
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
