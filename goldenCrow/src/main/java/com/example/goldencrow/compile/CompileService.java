package com.example.goldencrow.compile;

import com.example.goldencrow.file.Service.FileService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.*;
import java.util.Arrays;
import java.util.Map;
import java.util.Objects;

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
//            System.out.println("런이 안됨");
            e.printStackTrace();
            return "";
        } catch (InterruptedException e) {
            throw new RuntimeException(e);
        }

    }

    // 도커파일 생성
    public String createDockerfile(String filePath, Long teamSeq, String type) {
        int filePathIndex = filePath.lastIndexOf("/");
        String projectName = filePath.substring(filePathIndex);
//        String dockerfilePath = filePath + "/Dockerfile";
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
        File file = new File(filePath + "/Dockerfile");
        try {
            FileWriter overWriteFile = new FileWriter(file, false);
            overWriteFile.write(content);
            overWriteFile.close();
        } catch (IOException e) {
            return e.getMessage();
        }
        return "SUCCESS";

//        return saveDockerfile(filePath, teamSeq, content);
    }
    // 해당 컨테이너 포트 찾기
    public String portNum(String container) {
        String[] command = {"docker", "port", container};
        System.out.println("포트 찾기 ! container id : " + container + "!");
        return resultString(command);
    }


    public String pyCompile(Map<String, String> req, Long teamSeq) {
        String filePath = req.get("filePath");
        int filePathIndex = filePath.lastIndexOf("/");
        String projectName = filePath.substring(filePathIndex+1);
        // 퓨어파이썬일 때
        if (Objects.equals(req.get("type"), "pure")) {
//            String command = String.format("python3 %s", filePath);
            String[] command = {"python3", filePath};
            return resultString(command);
        }
        // Django 프로젝트일 때
        else if (Objects.equals(req.get("type"), "django")) {
            // 도커파일 추가
            String dockerfile = createDockerfile(filePath, teamSeq, req.get("type"));
            if (!Objects.equals(dockerfile, "SUCCESS")) { return "Can't make dockerfile"; }
            System.out.println("도커파일 만들기 성공! 빌드를 해보자");
            // 도커 이미지 빌드
//            String image = String.format("docker build -t %s .", projectName);
            String[] image = {"docker", "build", "-t", projectName, filePath+"/"};
            String imageBuild = resultString(image);
            if (imageBuild.isEmpty()) { return "Can't build docker image"; }
//            try {
//
//                System.out.println("build 명령어: " + Arrays.toString(image));
//                String result = "";
//                StringBuffer sb = new StringBuffer();
//                Process p = Runtime.getRuntime().exec(image);
//                BufferedReader in = new BufferedReader(new InputStreamReader(p.getInputStream()));
//                String cl;
//                while((cl = in.readLine()) != null){
//                    System.out.println(cl);
//                    sb.append(cl);
//                    sb.append("\n");
//                }
//                result = sb.toString();
//                p.waitFor();
//                in.close();
//                System.out.println("결과: " + result);
//                p.destroy();
//            } catch(IOException e){
//                System.out.println("이미지 빌드가 안됨");
//                e.printStackTrace();
//            } catch (InterruptedException e) {
//                throw new RuntimeException(e);
//            }
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

        else {
            return "not pure and not django";
        }

    }
}
