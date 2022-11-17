package com.example.goldencrow.file.service;


import com.example.goldencrow.file.FileEntity;
import com.example.goldencrow.file.FileRepository;

import com.example.goldencrow.file.dto.FileCreateDto;
import com.example.goldencrow.team.repository.TeamRepository;
import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.stereotype.Service;

import java.io.*;
import java.util.*;

import static com.example.goldencrow.common.Constants.*;


import static java.lang.System.out;

@Service
public class ProjectService {

    private final FileService fileService;
    private final FileRepository fileRepository;

    public ProjectService(FileService fileService, FileRepository fileRepository) {
        this.fileService = fileService;
        this.fileRepository = fileRepository;
    }

    /**
     * 디렉토리 만들어주기
     *
     * @param path
     * @param name
     * @return Dir or "2"
     */
    public String createDir(String path, String name) {
        String pjt = path + "/" + name;
        File pjtDir = new File(pjt);
        if (pjtDir.mkdir()) {
            return pjt;
        }
        ;
        return "2";
    }


    /**
     * 파일 경로를 모두 찾아서 HashMap으로 반환해주는 함수
     *
     * @param rootPath
     * @param rootName
     * @param visit
     * @return
     */
    public Map<Object, Object> readDirectory(String rootPath, String rootName, Map<Object, Object> visit) {
        String path = "/home/ubuntu/crow_data/" +rootPath;
        File file = new File(path);
        visit.put("id", rootPath);
        visit.put("name", rootName);
        if (file.isDirectory()) {
            List<Object> child = new ArrayList<>();
            File[] files = file.listFiles();
            String[] names = file.list();
            for (int i = 0; i < files.length; i++) {
                File dir = files[i];
                String name = names[i];
                String thisPath = dir.getPath();
                thisPath = thisPath.replace("/home/ubuntu/crow_data/","");
                Map<Object, Object> children = new HashMap<>();
                child.add(readDirectory(thisPath, name, children));
            }
            visit.put("children", child);
        }

        return visit;
    }


    /**
     * 모든 경로를 재귀적으로 찾고, db에 저장
     * @param path
     * @param teamSeq
     */
    public void saveFilesInDIr(String path, Long teamSeq) {
        File file = new File(path);
        FileCreateDto newFileCreateDto = new FileCreateDto(file.getName(),file.getPath(), teamSeq);
        fileService.insertFile(newFileCreateDto);

        File[] files = file.listFiles();
        if (files != null) {
            for (int i = 0; i < files.length; i++) {
                File dir = files[i];
                String thisPath = dir.getPath();

                if (dir.isDirectory()) {
                    saveFilesInDIr(thisPath,teamSeq);
                }
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

        String teamFile = createDir(path, String.valueOf(teamSeq));

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

            String newPath = teamFile + "/" + fileTitle + "/" + fileTitle + "/" + "settings.py";
            String change = changeSetting(newPath);

            if (!change.equals("1")) {
                return "호스트 세팅에 실패했습니다.";
            }

            String pjtPath = teamFile + "/" +fileTitle;
            saveFilesInDIr(pjtPath,teamSeq);
            return "1";
        } else if (type == 1) {
            String pjt = createDir(teamFile, fileTitle);
            if (pjt.equals("2")) {
                return "이미 폴더가 존재합니다";
            }

            File file = new File(pjt + "/" + fileTitle + ".py");
            try {
                if (file.createNewFile()) {
                    String pjtPath = pjt + "/" + fileTitle;
                    saveFilesInDIr(pjtPath,teamSeq);
                    return "1";
                } else {
                    return "이미 파일이 존재합니다";
                }
            } catch (IOException e) {
                return e.getMessage();
            }
        } else if (type == 3) {
            String pjt = createDir(teamFile, fileTitle);
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
            String pjtPath = pjt + "/" + fileTitle;
            saveFilesInDIr(pjtPath,teamSeq);
            return "1";
        } else if (type == 4) {
            String pjt = createDir(teamFile, fileTitle);
            if (pjt.equals("2")) {
                return "이미 폴더가 존재합니다";
            }
            String pjt1 = createDir(pjt, fileTitle);
            File file = new File(pjt1 + "/main.py");
            String content = "from fastapi import FastAPI\n\napp=FastAPI()\n\n@app.get(\"/\")\nasync def root():\n\treturn {\"message\" : \"Hello, World\"}";
            try (FileWriter overWriteFile = new FileWriter(file, false);) {
                overWriteFile.write(content);
            } catch (IOException e) {
                return e.getMessage();
            }
            String pjtPath = pjt + "/" + fileTitle;
            saveFilesInDIr(pjtPath,teamSeq);
            return "1";
        }
        return "프로젝트 생성에 실패했습니다";
    }

    /**
     * 팀 리스트에 속한 프로젝트를 모두 삭제하는 내부 로직
     *
     * @param teamSeqList 삭제하고자 하는 팀의 시퀀스로 이루어진 리스트
     * @return 성패에 따른 result 반환
     */
    public Map<String, String> deleteProject(List<Long> teamSeqList) {

        Map<String, String> serviceRes = new HashMap<>();

        try {
            ProcessBuilder deleter = new ProcessBuilder();
            for (Long seq : teamSeqList) {
                deleter.command("rm", "-r", String.valueOf(seq));
                deleter.directory(new File(BASE_URL));

                try {
                    deleter.start();
                } catch (IOException e) {
                    throw e;
                }
                pjtFileDelete(seq);
            }
            // 위의 과정을 무사히 통과했으므로
            serviceRes.put("result", SUCCESS);

        } catch (Exception e) {
            serviceRes.put("result", UNKNOWN);
        }

        return serviceRes;
    }

    /**
     * 해당 시퀀스에 해당하는 DB의 데이터를 모두 삭제
     * @param teamSeq
     */
    public void pjtFileDelete(Long teamSeq){
        Optional<List<FileEntity>> files = fileRepository.findAllByTeamSeq(teamSeq);
        if (!files.isPresent()) {
            throw new NullPointerException();
        }

        List<FileEntity> deleteFile = files.get();

        fileRepository.deleteAll(deleteFile);

    }


    /**
     * @param filePath - 파일 이름까지 붙어있는 filePath줘야 함
     * @return
     */
    public String changeSetting(String filePath) {
        out.println(filePath);
        String oldFileName = "settings.py";
        String tmpFileName = "tmp_settings.py";
        String newFilePath = filePath.replace(oldFileName, tmpFileName);
        BufferedReader br = null;
        BufferedWriter bw = null;
        out.println("여기 호스트 바꾸는 거!" + newFilePath);
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

                bw.write(line + "\n");
            }
        } catch (Exception e) {
            return e.getMessage();
        } finally {
            try {
                if (br != null)
                    br.close();
            } catch (IOException e) {
                //
            }
            try {
                if (bw != null)
                    bw.close();
            } catch (IOException e) {
                //
            }
        }
        String newPath = filePath.replace(oldFileName, "");
        out.println(newPath);
        ProcessBuilder pro = new ProcessBuilder("mv", tmpFileName, oldFileName);
        pro.directory(new File(newPath));

        try {
            pro.start();
        } catch (IOException e) {
            return e.getMessage();
        }
        return "1";
    }
}
