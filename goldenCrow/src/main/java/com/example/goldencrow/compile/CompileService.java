package com.example.goldencrow.compile;

import com.example.goldencrow.file.Service.FileService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.*;
import java.util.*;

@Service
public class CompileService {

    @Autowired
    private FileService fileService;

    // 실행 결과 반환 로직
    public String resultString(String[] cmd) {
        System.out.println("명령어 : "+ Arrays.toString(cmd));
        try{
            StringBuffer sb = new StringBuffer();
            Process p = Runtime.getRuntime().exec(cmd);
            BufferedReader in = new BufferedReader(new InputStreamReader(p.getInputStream()));
            String result = "";
            String cl;
            while((cl = in.readLine()) != null){
                System.out.println(cl);
                sb.append(cl);
                sb.append("\n");
            }
            result = sb.toString();
            p.waitFor();
            in.close();
            System.out.println("결과: " + result);
            p.destroy();
            return result.trim();
        }catch(IOException e){
            e.printStackTrace();
            return "";
        } catch (InterruptedException e) {
            throw new RuntimeException(e);
        }

    }

    // 도커파일 생성
    public String createDockerfile(String filePath, Long teamSeq, String type) {
        int filePathIndex = filePath.lastIndexOf("/");
        String projectName = filePath.substring(filePathIndex + 1);
        String content = "";
        if (Objects.equals(type, "django")) {
            content = "FROM python:3.10\n" +
                    "RUN pip3 install django\n" +
                    "WORKDIR " + filePath + "\n" +
                    "COPY . .\n" +
//                    "WORKDIR ." + projectName +
                    "CMD [\"python3\", \"manage.py\", \"runserver\", \"0.0.0.0:3000\"]\n" +
                    "EXPOSE 3000";
        }
        else if (Objects.equals(type, "fastapi")) {
            content = "FROM python:3.10\n" +
                    "WORKDIR " + filePath + "\n" +
//                    "COPY ./requirements.txt /prod/requirements.txt\n" +
//                    "RUN pip install --no-cache-dir --upgrade -r /prod/requirements.txt\n" +
//                    "COPY ./" + projectName + " /prod/" + projectName + "\n" +
                    "COPY . ." +
                    "CMD [\"uvicorn\", \"" + projectName + ".main:" + projectName + "\", \"--host\", \"0.0.0.0\", \"--port\", \"3000\"]";
        }
        File file = new File(filePath + "/Dockerfile");
        try {
            FileWriter overWriteFile = new FileWriter(file, false);
            overWriteFile.write(content);
            overWriteFile.close();
        } catch (IOException e) {
            return e.getMessage();
        }
        return "SUCCESS";
    }
    // 해당 컨테이너 포트 찾기
    public String portNum(String container) {
        String[] command = {"docker", "port", container};
        System.out.println("포트 찾기 ! container id : " + container + "!");
        return resultString(command);
    }

    public String pyCompile(Map<String, String> req, Long teamSeq) {
        List<String> types = new ArrayList<>(Arrays.asList("pure", "django", "fastapi", "flask"));
        // 타입 이상한 거 들어오면 리턴
        if (!types.contains(req.get("type"))) { return "Type error"; }
        String filePath = req.get("filePath");
        int filePathIndex = filePath.lastIndexOf("/");
        String projectName = filePath.substring(filePathIndex+1);
        // 퓨어파이썬일 때
        if (Objects.equals(req.get("type"), "pure")) {
            String[] command = {"python3", filePath};
            return resultString(command);
        }
        // Django, fastapi, flask 프로젝트일 때
        else {
            // 도커파일 추가
            String dockerfile = createDockerfile(filePath, teamSeq, req.get("type"));
            if (!Objects.equals(dockerfile, "SUCCESS")) { return "Can't make dockerfile"; }
            System.out.println("도커파일 만들기 성공! 빌드를 해보자");
        }
        // 도커 이미지 빌드
        String[] image = {"docker", "build", "-t", projectName, filePath+"/"};
        String imageBuild = resultString(image);
        if (imageBuild.isEmpty()) { return "Can't build docker image"; }
        System.out.println("런 해보쟈");
        // 도커 런
        String[] command = {"docker", "run", "-d", "--name", projectName, "-P", projectName};
        System.out.println(Arrays.toString(command));
        String container = resultString(command);
        if (container.isEmpty()) { return "Can't run docker container"; }
        String portString = portNum(container);
        // \n 전까지의 문자열에서 : 뒤에 있는 숫자만 가져오기
        String[] portList = portString.split("\n");
        System.out.println(Arrays.toString(portList));
        String[] realPort = portList[0].split(":");
        System.out.println(Arrays.toString(realPort));
        return "k7d207.p.ssafy.io:" + realPort[1];
    }
}
