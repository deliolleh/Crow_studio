package com.example.goldencrow.file.Service;


import com.example.goldencrow.file.Repository.FileRepository;

import com.example.goldencrow.team.repository.TeamRepository;
import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.stereotype.Service;

import java.io.*;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;


import static java.lang.System.out;

@Service
public class ProjectService {

    @Autowired
    private FileRepository fileRepository;

    @Autowired
    private TeamRepository teamRepository;

    private FileService fileService;

    /**
     * 디렉토리 만들어주기
     * @param path
     * @param name
     * @return Dir or "2"
     */
    public String createDir(String path, String name){
        String pjt = path + "/" + name;
        out.println(pjt);
        File pjtDir = new File(pjt);
        out.println(pjtDir);
        if (pjtDir.mkdir()) {
            return pjt;
        };
        return "2";
    }

    /**
     * 파일 DB에 저장하는 함수
     * @param fileCreateDto
     * @param team
     * @return Boolean
     */
//    public boolean saveFileEntity(FileCreateDto fileCreateDto, TeamEntity team) {
//        FileEntity fileEntity = new FileEntity(fileCreateDto,team);
//        fileRepository.saveAndFlush(fileEntity);
//        System.out.println(fileCreateDto.getFilePath()+fileCreateDto.getFileTitle());
//
//        System.out.println("파일 저장 제대로 됨!!");
//
//        return true;
//    }

    /**
     * 파일 경로를 모두 찾아서 HashMap으로 반환해주는 함수
     * @param rootPath
     * @param rootName
     * @param visit
     * @return 
     */
    public Map<List<String>,List<List<String>>> readDirectory(String rootPath, String rootName, Map<List<String>,List<List<String>>> visit){
        File file = new File(rootPath);
        File files[] = file.listFiles();
        String names[] = file.list();
        List<String> root = new ArrayList<>();
        root.add(rootName);
        root.add(rootPath);
        for (int i = 0; i < files.length; i++) {
            File dir = files[i];
            String name = names[i];
            String thisPath = dir.getPath();
            List<String> here = new ArrayList<>();
            here.add(name);
            here.add(thisPath);
            if (dir.isDirectory()) {
                List<List<String>> newValue = new ArrayList<>();
                visit.get(root).add(here);
                visit.put(here,newValue);
                readDirectory(thisPath,name,visit);
            } else {
                visit.get(root).add(here);
            }
        }
        return visit;
    }

    /**
     * 모든 경로를 재귀적으로 찾고, db에 저장
     * @param path
     * @param teamSeq
     */
//    public void saveFilesInDIr(String path, Long teamSeq) {
//        File file = new File(path);
//        File files[] = file.listFiles();
//        Optional<TeamEntity> team = teamRepository.findByTeamSeq(teamSeq);
//
//        TeamEntity thisTeam = team.get();
//
//        String names[] = file.list();
//        out.println("여기는 와요! 여긴!");
//        out.println(path + "여기는 저장 아아 여긴 저장");
//
//        for (int i = 0; i < files.length; i++) {
//            File dir = files[i];
//            String name = names[i];
//            String thisPath = dir.getPath();
//            FileCreateDto newFileCreateDto = new FileCreateDto(name,thisPath);
//            out.println(thisPath + name);
//            Boolean check = saveFileEntity(newFileCreateDto,thisTeam);
//            out.println("저장 결과!"+check);
//
//            if (dir.isDirectory()) {
//                saveFilesInDIr(thisPath,teamSeq);
//            }
//        }
//    }



    /**
     * 프로젝트 이니셜 파일 생성
     * type 1 = pure python
     * 2 = django
     * 3 = flask
     * 4 = fastapi
     */
    public String createProject(String path, Integer type, String projectName, Long teamSeq) {

        String teamFile = createDir(path,String.valueOf(teamSeq));

        if (teamFile.equals("2")) {
            return "이미 폴더가 존재합니다";
        }

        String fileTitle = projectName;

        if (type == 2) {

            ProcessBuilder djangoStarter = new ProcessBuilder();
            djangoStarter.command("django-admin", "startproject", fileTitle);
            djangoStarter.directory(new File(teamFile));

            try {
                Process p = djangoStarter.start();
                p.waitFor();
            } catch (IOException e) {
                return e.getMessage();
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
                return e.getMessage();

            }

            String newPath = teamFile + "/" + fileTitle + "/" +fileTitle + "/" + "settings.py";
            String change = changeSetting(newPath);

//            saveFilesInDIr(path,teamSeq);
            return "1";
        } else if (type == 1) {
            String pjt = createDir(teamFile,fileTitle);
            if (pjt.equals("2")) {
//                saveFilesInDIr(path,teamSeq);
                return "이미 폴더가 존재합니다";
            }

            File file = new File(pjt + "/" + fileTitle +".py");
            try {
                if(file.createNewFile()) {
//                    saveFilesInDIr(path,teamSeq);
                    return "1";
                } else {
                    return "이미 파일이 존재합니다";
                }
            } catch (IOException e) {
                return e.getMessage();
            }
        } else if (type == 3) {
            String pjt = createDir(teamFile,fileTitle);
            if (pjt.equals("2")) {
                return "이미 폴더가 존재합니다";
            }
            File file = new File(pjt + "/main.py");

            String content = "from flask import Flask\n\napp=Flask(__name__)\n\n@app.route(\"/\")\ndef hello_world():\n\treturn \"<p>Hello, World</p>\" \n\nif __name__ == \"__main__\" :\n\tapp.run(\"0.0.0.0\")";

            try (FileWriter overWriteFile = new FileWriter(file, false);) {
                overWriteFile.write(content);
            } catch (IOException e) {
                return e.getMessage();
            }
//            saveFilesInDIr(path,teamSeq);
            return "1";
        } else if (type == 4) {
            String pjt = createDir(teamFile,fileTitle);
            if (pjt.equals("2")) {
                return "이미 폴더가 존재합니다";
            }
            String pjt1 = createDir(pjt,fileTitle);
            File file = new File(pjt1 + "/main.py");
            String content = "from fastapi import FastAPI\n\napp=FastAPI()\n\n@app.get(\"/\")\nasync def root():\n\treturn {\"message\" : \"Hello, World\"}";
            try(FileWriter overWriteFile = new FileWriter(file, false);) {
                overWriteFile.write(content);
            } catch (IOException e) {
                return e.getMessage();
            }
//            saveFilesInDIr(path,teamSeq);
            return "1";
        }
        return "프로젝트 생성에 실패했습니다";
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


    /**
     *
     * @param filePath - 파일 이름까지 붙어있는 filePath줘야 함
     * @return
     */
    public String changeSetting (String filePath) {
        out.println(filePath);
        String oldFileName = "settings.py";
        String tmpFileName = "tmp_settings.py";
        String newFilePath = filePath.replace(oldFileName,tmpFileName);
        BufferedReader br = null;
        BufferedWriter bw = null;
        out.println("여기 호스트 바꾸는 거!" +  newFilePath);
        try {
            br = new BufferedReader(new FileReader(filePath));
            bw = new BufferedWriter(new FileWriter(newFilePath));
            String line;
            while ((line = br.readLine()) != null) {

                if (line.contains("ALLOWED_HOSTS = []")) {
                    out.println(line);
                    line = line.replace("ALLOWED_HOSTS = []", "ALLOWED_HOSTS = [\"k7d207.p.ssafy.io\"]");
                    out.println(line);
                }

                bw.write(line+"\n");
            }
        } catch (Exception e) {
            return e.getMessage();
        } finally {
            try {
                if(br != null)
                    br.close();
            } catch (IOException e) {
                //
            }
            try {
                if(bw != null)
                    bw.close();
            } catch (IOException e) {
                //
            }
        }
        String newPath = filePath.replace(oldFileName,"");
        out.println(newPath);
        ProcessBuilder pro = new ProcessBuilder("mv",tmpFileName,oldFileName);
        pro.directory(new File(newPath));

        try {
            pro.start();
        } catch (IOException e) {
            return  e.getMessage();
        }
        return "1";
    }
}
