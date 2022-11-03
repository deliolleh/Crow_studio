package com.example.goldencrow.file.Service;

import com.example.goldencrow.file.Repository.FileRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.*;

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
        String baseUrl = "/home/ubuntu/crow_data";
        ProcessBuilder here = new ProcessBuilder("ls");
        here.directory(new File(baseUrl));
        out.println(path);
        ProcessBuilder test = new ProcessBuilder("touch test.py");
        test.directory(new File(baseUrl));
        String newPath = "."+path+"/";
        try{
            test.start();
            Process p = here.start();
            InputStream stderr = p.getInputStream();
            InputStreamReader isr = new InputStreamReader(stderr);
            BufferedReader br = new BufferedReader(isr);
            String line = null;

            while ((line = br.readLine()) != null) {
                System.out.println(line);
            }

            p.waitFor();
            System.out.println("Waiting ...");

        } catch (IOException e) {
            out.println(e.getMessage());
        } catch (InterruptedException e) {
            out.println(e.getMessage());
        }

        if (type == 2) {
            ProcessBuilder django = new ProcessBuilder(String.format("django-admin startproject %s",fileTitle));
            django.directory(new File(baseUrl));
            ProcessBuilder djangoStarter = new ProcessBuilder();
            djangoStarter.command(String.format("django-admin startproject %s",fileTitle));
            out.println(fileTitle);
            djangoStarter.directory(new File(path+"/"));
            try {
                django.start();
                out.println("여기까진 와요!");
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

    public String saveProject(){
        return "true";
    }
}
