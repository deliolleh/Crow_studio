package com.example.goldencrow.compile;

import com.example.goldencrow.file.dto.FileCreateDto;
import com.example.goldencrow.file.service.FileService;
import com.example.goldencrow.file.service.ProjectService;
import com.example.goldencrow.team.entity.TeamEntity;
import com.example.goldencrow.team.repository.TeamRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.*;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.*;

import static com.example.goldencrow.common.Constants.*;

/**
 * 컴파일과 관련된 로직을 처리하는 Service
 */
@Service
public class CompileService {
    private String FLASK = "import Flask";
    private String FASTAPI = "import FastAPI";
    private String DJANGO = "from django.core.wsgi";

    @Autowired
    private FileService fileService;
    @Autowired
    private ProjectService projectService;

    @Autowired
    private TeamRepository teamRepository;

    /**
     * 명령어를 linux bash에 입력, 출력된 내용을 String으로 반환하는 내부 로직
     *
     * @param cmd 명령어
     * @return 명령어 수행 성공 시 결과 문자열 반환, 성패에 따른 result 반환
     */
    public String resultStringService(String[] cmd) {
        System.out.println(Arrays.toString(cmd));
        ProcessBuilder command = new ProcessBuilder(cmd);
        command.redirectErrorStream(true);
        StringBuilder msg = new StringBuilder();

        try {
            String read;
            Process p = command.start();
            BufferedReader result = new BufferedReader(new InputStreamReader(p.getInputStream()));
            while ((read = result.readLine()) != null) {
                msg.append(read).append("\n");
            }
            p.waitFor();
        } catch (IOException e) {
            return NO_SUCH;
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            return UNKNOWN;
        }
        return msg.toString();
//            StringBuffer sb = new StringBuffer();
//            Process p = Runtime.getRuntime().exec(cmd);
//            BufferedReader in = new BufferedReader(new InputStreamReader(p.getInputStream()));
//            String result = "";
//            String cl;
//            while ((cl = in.readLine()) != null) {
//                sb.append(cl);
//                sb.append("\n");
//            }
//            result = sb.toString();
//            p.waitFor();
//            in.close();
//            p.destroy();
//            return result.trim();
//        } catch (IOException | InterruptedException e) {
//            return e.getMessage();
//        }
    }

    /**
     * 각 프로젝트 종류에 따라 도커파일을 생성하는 내부 로직
     *
     * @param absolutePath 도커파일을 생성하려는 절대 경로
     * @param teamSeq      도커파일을 생성하려는 프로젝트의 팀 sequence
     * @param type         프로젝트의 타입 번호 (1: pure python, 2: django, 3: flask, 4: fastapi)
     * @return 성패에 따른 result 반환
     */
    public String createDockerfile(String absolutePath, Long teamSeq, int type, String input, String outfilePath) {
        // teamSeq가 DB에 존재하는지 체크
        Optional<TeamEntity> existTeam = teamRepository.findByTeamSeq(teamSeq);
        if (!existTeam.isPresent()) {
            return NO_SUCH;
        }
        String[] pathList = absolutePath.split("/");
        String projectName = pathList[5];
        String projectPath = pathList[0] + "/" + pathList[1] + "/" + pathList[2] + "/"
                + pathList[3] + "/" + pathList[4] + "/" + pathList[5];
        String content = "";

        // 1: pure Python, 2 : Django, 3 : Flask, 4 : FastAPI
        if (type == 1) {
            if (input.isEmpty()) {
                content = "FROM python:3.10\n" +
                        "CMD [\"python3\", \"" + absolutePath + "\"]\n" +
                        "EXPOSE 3000";
            } else {
                String inputString = "\"" + input + "\"";
                content = "FROM python:3.10\n" +
                        "CMD [\"/bin/sh\", \"-c\", \"echo\", " + inputString +
                        " \"|\", \"python3\", \"" + absolutePath +
//                    "\", \"2>\"" + outfilePath +
                        "\"]\n" +
                        "EXPOSE 3000";
            }
        } else if (type == 2) {
            content = "FROM python:3.10\n" +
                    "RUN pip3 install django\n" +
                    "WORKDIR " + absolutePath + "\n" +
                    "COPY . .\n" +
                    "CMD [\"python3\", \"manage.py\", \"runserver\", \"0.0.0.0:3000\"]\n" +
                    "EXPOSE 3000";
        } else if (type == 3) {
            content = "FROM python:3.10\n" +
                    "WORKDIR " + absolutePath + "\n" +
                    "COPY . .\n" +
                    "RUN pip3 install Flask\n" +
                    "EXPOSE 5000\n" +
                    "CMD [ \"python3\" , \"main.py\", \"run\", \"--host=0.0.0.0\"]";
        } else if (type == 4) {
            content = "FROM python:3.10\n" +
                    "WORKDIR " + absolutePath + "\n" +
                    "RUN python3 -m venv venv\n" +
                    "RUN . ./venv/bin/activate\n" +
                    "RUN pip3 install uvicorn[standard]\n" +
                    "RUN pip3 install fastapi\n" +
                    "COPY . .\n" +
                    "EXPOSE 8000\n" +
                    "CMD [\"uvicorn\", \"" + projectName + ".main:app" + "\", \"--host\", \"0.0.0.0\"]";
        }

        // Dockerfile 생성
        File file = new File(projectPath + "/Dockerfile");

        // Dockerfile에 content 저장
        try (FileWriter overWriteFile = new FileWriter(file, false)) {
            overWriteFile.write(content);
        } catch (IOException e) {
            return UNKNOWN;
        }
        // DB에 저장
        FileCreateDto fileCreateDto;
        fileCreateDto =
                new FileCreateDto("Dockerfile", projectPath + "/Dockerfile", teamSeq);
        fileService.insertFileService(fileCreateDto);
        return SUCCESS;
    }

    /**
     * 컨테이너 Id로 사용중인 포트 번호를 찾는 내부 로직
     *
     * @param container 포트를 찾으려는 컨테이너 Id
     * @return 명령어를 수행하고 나온 출력값 반환
     */
    public String portNumService(String container) {
        // linux bash에서 포트 번호를 검색하는 명령어
        String[] command = {"docker", "port", container};

        // 명령어 실행 로직 수행
        String result = resultStringService(command);
        System.out.println(result);
        if (result.startsWith("Error: No such container")) {
            return NO_SUCH;
        }
        // \n 전까지의 문자열에서 : 뒤에 있는 숫자만 가져오기
        String[] portList = result.split("\n");
        String[] containerPort = portList[0].split(":");
        System.out.println(Arrays.toString(containerPort));
        // 서버 URL 생성
        return containerPort[1];
    }

    /**
     * 프로젝트 혹은 파일을 컴파일하는 내부 로직
     *
     * @param type     프로젝트의 타입 (1: pure Python, 2: Django, 3: Flask, 4: FastAPI)
     * @param filePath 컴파일을 수행할 프로젝트 혹은 파일의 경로
     * @param input    pure python 파일일 때 input값 (없으면 빈 문자열)
     * @return 컴파일 성공 시 컴파일 결과 반환, 성패에 따른 result 반환
     */
    public Map<String, String> pyCompileService(int type, String filePath, String input) {
        Map<String, String> serviceRes = new HashMap<>();
        String[] pathList = filePath.split("/");
        String teamSeq = pathList[0];
        String teamName = pathList[1];
        // 프로젝트명과 teamSeq로 docker container와 image 이름 생성
        String conAndImgName = "crowstudio_" + teamName.toLowerCase().replaceAll(" ", "") + "_" + teamSeq;
        // 현재 실행되고 있는 컨테이너, 이미지 삭제, 도커파일 삭제
        pyCompileStopService(teamName, teamSeq);
        String port = "3500";
        // 절대경로 생성
        String absolutePath;
        // pure Python일 경우 파일명까지, 프로젝트일 경우 프로젝트명까지 절대경로로 선언
        if (type == 1) {
            absolutePath = BASE_URL + filePath;
        } else {
            absolutePath = BASE_URL + teamSeq + "/" + teamName;
        }

        String outfilePath = BASE_URL + "outfile/" + teamSeq + ".txt";
        String projectPath = BASE_URL + teamSeq + "/" + teamName;
        // 에러가 발생할 경우 에러메세지를 저장할 파일 생성
//        File file = new File(outfilePath);
//        try {
//            if (!file.createNewFile()) {
//                serviceRes.put("result", DUPLICATE);
//                return serviceRes;
//            }
//        } catch (IOException e) {
//            serviceRes.put("result", DUPLICATE);
//            return serviceRes;
//        }
        // 도커 파일 생성
        String dockerfile = createDockerfile(absolutePath, Long.valueOf(teamSeq), type, input, outfilePath);
        if (!Objects.equals(dockerfile, "SUCCESS")) {
            serviceRes.put("result", dockerfile);
            return serviceRes;
        }

        // 도커 이미지 빌드
        String[] image = {"docker", "build", "-t", conAndImgName, projectPath + "/"};
        String imageBuild = resultStringService(image);
        if (imageBuild.isEmpty()) {
            serviceRes.put("result", UNKNOWN);
            return serviceRes;
        }
        String insidePort;
        switch (type) {
            case 3:
                insidePort = ":5000";
                break;
            case 4:
                insidePort = ":8000";
                break;
            default:
                insidePort = ":3000";
                break;
        }

        // 도커 컨테이너 런
        String[] command;
        if (type == 1) {
            command = new String[]{"docker", "run", "-d", "--name", conAndImgName, "-v",
                    BASE_URL + teamSeq + ":" + BASE_URL + teamSeq, "-p", port + insidePort, conAndImgName};
        } else {
            command = new String[]{"docker", "run", "--rm", "-d", "--name", conAndImgName, "-p", port + insidePort, conAndImgName};
        }

//        String container = resultStringService(command);

        // 결과 문자열
        String response = resultStringService(command);

//        // 에러 메세지 파일에서 읽어오기
//        Map<String, String> messageList = fileService.readFileService(outfilePath);
//        String message = messageList.get("fileContent");
//        String pathChangemessage = message;
//        if (message.contains(BASE_URL)) {
//            pathChangemessage = message.replaceAll(BASE_URL + teamSeq + "/", "");
//        }
//        Path path = Paths.get(outfilePath);
//        try {
//            Files.deleteIfExists(path);
//        } catch (IOException ioe) {
//            serviceRes.put("result", UNKNOWN);
//            return serviceRes;
//        }
//        // 파일 경로가 틀린 경우
//        if (pathChangemessage.contains("Errno 2")) {
//            serviceRes.put("result", NO_SUCH);
//            return serviceRes;
//        } else {
//            serviceRes.put("result", SUCCESS);
//            serviceRes.put("message", pathChangemessage);
//            serviceRes.put("response", response);
//            return serviceRes;
//        }
        if (type == 1) {
            String[] pythonCmd = {"docker", "logs", "-f", conAndImgName};
            String pythonResponse = resultStringService(pythonCmd);
            System.out.println(pythonResponse);
            serviceRes.put("result", SUCCESS);
            serviceRes.put("response", pythonResponse);
            return serviceRes;
        } else if (portNumService(conAndImgName).equals(port)) {
            serviceRes.put("result", SUCCESS);
            serviceRes.put("response", "k7d207.p.ssafy.io:" + port);
            return serviceRes;
        } else {
            serviceRes.put("result", SUCCESS);
            serviceRes.put("response", response);
            return serviceRes;
        }

        // 서버 URL 생성
//        String response = "k7d207.p.ssafy.io:" + port;
//        serviceRes.put("result", SUCCESS);
//        serviceRes.put("response", response);

    }

    /**
     * 컴파일 중단을 처리하는 내부로직
     *
     * @param teamName 컴파일 중단할 프로젝트의 팀 이름
     * @param teamSeq  컴파일 중단할 프로젝트의 팀 sequence
     * @return 성패에 따른 result 반환
     */
    public Map<String, String> pyCompileStopService(String teamName, String teamSeq) {
        String conAndImgName = "crowstudio_" + teamName.toLowerCase().replaceAll(" ", "") + "_" + teamSeq;

        // 도커 컨테이너 멈추기
        String[] containerStop = {"docker", "stop", conAndImgName};
        Map<String, String> serviceRes = new HashMap<>();
        String stopedCon = resultStringService(containerStop);
        // 컨테이너가 없는 경우
        if (stopedCon.equals("No such container")) {
            serviceRes.put("result", NO_SUCH);
            return serviceRes;
        } else if (!stopedCon.equals(conAndImgName)) {
            serviceRes.put("result", UNKNOWN);
            return serviceRes;
        }

        // 컨테이너 삭제
        String[] containerRm = {"docker", "rm", conAndImgName};
        String removedCon = resultStringService(containerRm);
        // 컨테이너가 없는 경우
        if (removedCon.equals("No such container")) {
            serviceRes.put("result", NO_SUCH);
            return serviceRes;
        } else if (!removedCon.equals(conAndImgName)) {
            serviceRes.put("result", UNKNOWN);
            return serviceRes;
        }

        // 도커 이미지 삭제
        String[] imageRm = {"docker", "rmi", conAndImgName};
        String rmImg = resultStringService(imageRm);

        // 이미지가 없는 경우
        if (rmImg.contains("No such image")) {
            serviceRes.put("result", NO_SUCH);
            return serviceRes;
        } else if (rmImg.startsWith("Error")) {
            serviceRes.put("result", UNKNOWN);
            return serviceRes;
        }

        // 도커파일 삭제
        Map<String, String> deletedFile = fileService.deleteFileService(
                BASE_URL + teamSeq + "/" + teamName + "/Dockerfile", 2, Long.parseLong(teamSeq));
        if (!deletedFile.get("result").equals(SUCCESS)) {
            serviceRes.put("result", deletedFile.get("result"));
            return serviceRes;
        }
        serviceRes.put("result", SUCCESS);
        return serviceRes;
    }

    /**
     * 팀 생성 시 자동으로 최초 컨테이너를 생성시켜 포트를 할당하는 내부 로직
     *
     * @param teamName 생성된 팀의 이름
     * @param teamSeq  생성된 팀의 Sequence
     * @return 생성된 컨테이너의 포트 번호, 성패에 따른 result 반환
     */
    public Map<String, String> containerCreateService(String teamName, Long teamSeq) {
        Map<String, String> serviceRes = new HashMap<>();
        String conAndImgName = "crowstudio_" + teamName.toLowerCase().replaceAll(" ", "") + "_" + teamSeq;
        // python docker images로 초기 컨테이너 생성 및 포트 할당
        String[] cmd = {"docker", "run", "-d", "--name", conAndImgName, "-P", "python"};
        String container = resultStringService(cmd);
        // 포트번호 가져오기
        String portString = portNumService(conAndImgName);
        if (portString.equals(NO_SUCH)) {
            serviceRes.put("result", WRONG);
            return serviceRes;
        }
        serviceRes.put("port", portString);
        serviceRes.put("result", SUCCESS);
        return serviceRes;
    }

    /**
     * 프로젝트 타입 구분하는 내부 로직
     *
     * @param filePath 구분할 프로젝트 경로
     * @return 프로젝트 타입 반환
     */
    public int findProjectTypeService(String filePath) {
        String[] pathList = filePath.split("/");
        String projectPath = BASE_URL + pathList[0] + "/" + pathList[1];
        List<String> initialList = new ArrayList<>();
        List<String> fileList = showFilesInDIr(projectPath, initialList);
        if (fileList == null) {
            return 0;
        }
        // 통상적인 Django에 있는 wsgi.py가 있고 그 안에 from django.core.wsgi 가 있으면 Django 프로젝트
        if (fileList.contains(BASE_URL + projectPath + "wsgi.py")) {
            Map<String, String> settingFile = fileService.readFileService(BASE_URL + projectPath + "wsgi.py");
            String settingContent = settingFile.get("fileContent");
            if (settingContent.contains(DJANGO)) {
                return 2;
            }
        }
        for (String file : fileList) {
            Map<String, String> fileContentRes = fileService.readFileService(file);
            String fileContent = fileContentRes.get("fileContent");
            if (fileContent.contains(FASTAPI)) {
                return 4;
            } else if (fileContent.contains(FLASK)) {
                return 3;
            } else if (fileContent.contains(DJANGO)) {
                return 2;
            }
        }
        return 1;
    }

    /**
     * 프로젝트에 있는 모든 파일을 리스트로 반환하는 내부 로직
     *
     * @param filePath 파일 조회할 프로젝트 경로
     * @param fileList 현재 파일 리스트
     * @return 파일 리스트 반환
     */
    public List<String> showFilesInDIr(String filePath, List<String> fileList) {
        System.out.println(filePath);
        File dir = new File(filePath);
        File[] files = dir.listFiles();
        if (files == null) {
            return null;
        }
        for (File file : files) {
            if (file.isDirectory()) {
                showFilesInDIr(file.getPath(), fileList);
            } else {
                fileList.add(file.getPath());
            }
        }
        return fileList;
    }
}
