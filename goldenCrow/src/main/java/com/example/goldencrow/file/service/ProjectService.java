package com.example.goldencrow.file.service;


import com.example.goldencrow.file.FileEntity;
import com.example.goldencrow.file.FileRepository;

import com.example.goldencrow.file.dto.FileCreateDto;
import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.stereotype.Service;

import java.io.*;
import java.util.*;

import static com.example.goldencrow.common.Constants.*;


import static java.lang.System.out;

@Service
public class ProjectService {

    private final FileService fileService;
    @Autowired
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
    public String createDirService(String path, String name) {
        String pjt = path + name;
        File pjtDir = new File(pjt);
        if (pjtDir.mkdir()) {
            return pjt;
        }
        return DUPLICATE;
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
        String path = BASE_URL + rootPath;
        File file = new File(path);
        visit.put("id", rootPath);
        visit.put("name", rootName);
        if (file.isDirectory()) {
            List<Object> child = new ArrayList<>();
            File[] files = file.listFiles();
            String[] names = file.list();
            if (files == null) {
                Map<Object, Object> errorValue = new HashMap<>();
                errorValue.put("error", NO_SUCH);
                return errorValue;
            }
            for (int i = 0; i < files.length; i++) {
                File dir = files[i];
                String name = names[i];
                String thisPath = dir.getPath();
                thisPath = thisPath.replace(BASE_URL, "");
                Map<Object, Object> children = new HashMap<>();
                child.add(readDirectory(thisPath, name, children));
            }
            visit.put("children", child);
            visit.put("type", "folder");
        }

        if (!file.isDirectory()) {
            String fileType = checkName(file.getName());
            visit.put("type", fileType);
        }
        return visit;
    }

    /**
     * 파일 이름에 무엇이 포함되냐에 따라 파일 종류 나누기
     *
     * @param fileName 판별할 파일 이름
     * @return 파이썬, html, css, js, text
     */
    public String checkName(String fileName) {
        if (fileName.contains(".py")) {
            return "python";
        } else if (fileName.contains(".html")) {
            return "html";
        } else if (fileName.contains(".js")) {
            return "js";
        } else if (fileName.contains(".css")) {
            return "css";
        }
        return "text";
    }

    /**
     * 모든 경로를 재귀적으로 찾고, db에 저장
     *
     * @param path
     * @param teamSeq
     */
    public void saveFilesInDIr(String path, Long teamSeq) {
        File file = new File(path);

        File[] files = file.listFiles();
        if (files != null) {
            for (int i = 0; i < files.length; i++) {
                File dir = files[i];
                if (dir.getName().equals(".git")) {
                    continue;
                }
                FileCreateDto newFileCreateDto = new FileCreateDto(dir.getName(), dir.getPath(), teamSeq);

                fileService.insertFileService(newFileCreateDto);

                if (dir.isDirectory()) {
                    String thisPath = dir.getPath();
                    saveFilesInDIr(thisPath, teamSeq);

                }
            }
        }
    }

    /**
     * 프로젝트 생성 내부 로직
     *
     * @param path        프로젝트 생성할 경로
     * @param type        생성할 프로젝트의 종류 (1: pure Python, 2: Django, 3: Flask, 4: FastAPI)
     * @param projectName 생성할 프로젝트의 이름
     * @param teamSeq     생성할 프로젝트의 팀 Sequence
     * @return 성패에 따른 result 반환
     */
    public Map<String, String> createProjectService(String path, int type, String projectName, Long teamSeq) {
        Map<String, String> serviceRes = new HashMap<>();
        String teamFile = createDirService(path, String.valueOf(teamSeq));

        if (teamFile.equals(DUPLICATE)) {
            serviceRes.put("result", DUPLICATE);
            return serviceRes;
        }

        // 기본 프로젝트 구성, 기본 파일 생성
        if (type == 2) {
            ProcessBuilder djangoStarter = new ProcessBuilder();
            djangoStarter.command("django-admin", "startproject", projectName);
            djangoStarter.directory(new File(teamFile));

            try {
                Process p = djangoStarter.start();
                p.waitFor();
            } catch (IOException e) {
                serviceRes.put("result", UNKNOWN);
                return serviceRes;
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
                serviceRes.put("result", UNKNOWN);
                return serviceRes;
            }

            String newPath = teamFile + "/" + projectName + "/" + projectName + "/" + "settings.py";
            String changeSetting = changeSettingService(newPath);

            if (!changeSetting.equals(SUCCESS)) {
                serviceRes.put("result", UNKNOWN);
                return serviceRes;
            }

            // file 저장
            String pjtPath = teamFile + "/" + projectName;
            saveFilesInDIr(pjtPath, teamSeq);
            serviceRes.put("result", SUCCESS);
            return serviceRes;
        } else if (type == 1) {
            String pjt = createDirService(teamFile, projectName);
            if (pjt.equals(DUPLICATE)) {
                serviceRes.put("result", DUPLICATE);
                return serviceRes;
            }

            File file = new File(pjt + "/" + projectName + ".py");
            try {
                if (file.createNewFile()) {
                    String pjtPath = pjt + "/" + projectName;
                    saveFilesInDIr(pjtPath, teamSeq);
                    serviceRes.put("result", SUCCESS);
                } else {
                    serviceRes.put("result", DUPLICATE);
                }
                return serviceRes;
            } catch (IOException e) {
                serviceRes.put("result", UNKNOWN);
                return serviceRes;
            }
        } else if (type == 3) {
            String pjt = createDirService(teamFile, projectName);
            if (pjt.equals(DUPLICATE)) {
                serviceRes.put("result", DUPLICATE);
                return serviceRes;
            }
            File file = new File(pjt + "/main.py");

            String content = "from flask import Flask\n" +
                    "import sys\n" +
                    "sys.path.append('/prod/app')\n\n" +
                    "app=Flask(__name__)\n\n" +
                    "@app.route(\"/\")\n" +
                    "def hello_world():\n" +
                    "\treturn \"<p>Hello, World</p>\" \n\n" +
                    "if __name__ == \"__main__\" :\n" +
                    "\tapp.run(\"0.0.0.0\")";

            // 파일에 내용 저장
            try (FileWriter overWriteFile = new FileWriter(file, false)) {
                overWriteFile.write(content);
            } catch (IOException e) {
                serviceRes.put("result", UNKNOWN);
                return serviceRes;
            }
            String pjtPath = pjt + "/" + projectName;
            saveFilesInDIr(pjtPath, teamSeq);
            serviceRes.put("result", SUCCESS);
            return serviceRes;
        } else if (type == 4) {
            String pjt = createDirService(teamFile, projectName);
            if (pjt.equals(DUPLICATE)) {
                serviceRes.put("result", DUPLICATE);
                return serviceRes;
            }
            String pjt1 = createDirService(pjt, projectName);
            File file = new File(pjt1 + "/main.py");

            // main.py에 저장할 내용
            String content = "from fastapi import FastAPI\n" +
                    "import sys\nsys.path.append('/prod/app')\n\n" +
                    "app=FastAPI()\n\n" +
                    "@app.get(\"/\")\n" +
                    "async def root():\n\t" +
                    "return {\"message\" : \"Hello, World\"}";

            // 파일에 내용 저장
            try (FileWriter overWriteFile = new FileWriter(file, false)) {
                overWriteFile.write(content);
            } catch (IOException e) {
                serviceRes.put("result", UNKNOWN);
                return serviceRes;
            }
            String pjtPath = pjt + "/" + projectName;
            saveFilesInDIr(pjtPath, teamSeq);
            serviceRes.put("result", SUCCESS);
            return serviceRes;
        }
        serviceRes.put("result", UNKNOWN);
        return serviceRes;
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
     *
     * @param teamSeq
     */
    public void pjtFileDelete(Long teamSeq) {
        Optional<List<FileEntity>> files = fileRepository.findAllByTeamSeq(teamSeq);
        if (!files.isPresent()) {
            throw new NullPointerException();
        }

        List<FileEntity> deleteFile = files.get();

        fileRepository.deleteAll(deleteFile);

    }


    /**
     * Django project의 settings.py에서
     * ALLOWED_HOSTS에 서버 주소를 넣어 배포가 가능하게 하는 내부 로직
     *
     * @param filePath 파일의 경로 (파일 이름까지 포함)
     * @return 성패에 따른 result string 반환
     */
    public String changeSettingService(String filePath) {
        String oldFileName = "settings.py";
        String tmpFileName = "tmp_settings.py";
        String newFilePath = filePath.replace(oldFileName, tmpFileName);
        // 기존 settings.py의 내용을 불러오되 ALLOWED_HOST 부분 수정하여 저장
        try (BufferedReader br = new BufferedReader(new FileReader(filePath));
             BufferedWriter bw = new BufferedWriter(new FileWriter(newFilePath))) {
            String line;
            while ((line = br.readLine()) != null) {
                if (line.contains("ALLOWED_HOSTS = []")) {
                    line = line.replace("ALLOWED_HOSTS = []",
                            "ALLOWED_HOSTS = [\"k7d207.p.ssafy.io\"]");
                }
                bw.write(line + "\n");
            }
        } catch (Exception e) {
            return UNKNOWN;
        }

        String newPath = filePath.replace(oldFileName, "");
        ProcessBuilder pro = new ProcessBuilder("mv", tmpFileName, oldFileName);
        pro.directory(new File(newPath));

        try {
            pro.start();
        } catch (IOException e) {
            return UNKNOWN;
        }
        return SUCCESS;
    }
}
