package com.example.goldencrow.compile;

import com.example.goldencrow.file.service.FileService;
import com.example.goldencrow.team.entity.TeamEntity;
import com.example.goldencrow.team.repository.TeamRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.*;
import java.util.*;

@Service
public class CompileService {

    @Autowired
    private FileService fileService;

    @Autowired
    private TeamRepository teamRepository;

    // 실행 결과 반환 로직
    public String resultString(String[] cmd) {
//        System.out.println("명령어 : "+ Arrays.toString(cmd));
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
        }catch(IOException | InterruptedException e){
            e.printStackTrace();
            return "";
        }

    }

    // 도커파일 생성
    /*
    filePath = /home/ubuntu/crow_data/{teamSeq}/{projectName}
    */
    public String createDockerfile(String filePath, Long teamSeq, int type) {
        // filePath가 /home/ubuntu/crow_data/로 시작하는지 확인
        boolean rightPath = filePath.startsWith("/home/ubuntu/crow_data/");
        if (!rightPath) { return "Error: Wrong file path(not /home/ubuntu/crow_data/)"; }
        // teamSeq가 있는지 확인
        Optional<TeamEntity> existTeam = teamRepository.findByTeamSeq(teamSeq);
        if (!existTeam.isPresent()) { return "Error: Can't Search team"; }
        // teamSeq랑 filePath에 있는 숫자랑 같은지 확인
        String[] pathList = filePath.split("/");
        if (Long.parseLong(pathList[4]) != teamSeq) { return "Error: Wrong file Path(teamSeq)"; }
//        int filePathIndex = filePath.lastIndexOf("/");
        String projectName = pathList[5];
        String content = "";
        // django
        if (type == 2) {
            content = "FROM python:3.10\n" +
                    "RUN pip3 install django\n" +
                    "WORKDIR " + filePath + "\n" +
                    "COPY . .\n" +
//                    "WORKDIR ." + projectName +
                    "CMD [\"python3\", \"manage.py\", \"runserver\", \"0.0.0.0:3000\"]\n" +
                    "EXPOSE 3000";
        }
        else if (type == 4) {  // fastapi
            content = "FROM python:3.10\n" +
                    "WORKDIR " + filePath + "\n" +
                    "RUN python3 -m venv venv\n" +
                    "RUN . ./venv/bin/activate\n" +
                    "RUN pip3 install uvicorn[standard]\n" +
                    "RUN pip3 install fastapi\n" +
//                    "COPY ./requirements.txt /prod/requirements.txt\n" +
//                    "RUN pip install --no-cache-dir --upgrade -r /prod/requirements.txt\n" +
                    "COPY . .\n" +
                    "EXPOSE 8000\n" +
                    "CMD [\"uvicorn\", \"" + projectName + ".main:app" + "\", \"--host\", \"0.0.0.0\"]";
        }
        else if (type == 3) {  // flask
            content = "FROM python:3.10\n" +
                    "WORKDIR " + filePath + "\n" +
                    "COPY . .\n" +
                    "RUN pip3 install Flask\n" +
//                    "COPY requirements.txt requirements.txt\n" +7
//                    "RUN pip3 install -r requirements.txt\n" +
                    "EXPOSE 5000\n" +
                    "CMD [ \"python3\" , \"main.py\", \"run\", \"--host=0.0.0.0\"]";
        }
        File file = new File(filePath + "/Dockerfile");
        try (FileWriter overWriteFile = new FileWriter(file, false)) {
            overWriteFile.write(content);
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
    /*
     * type 1 = pure python
     * 2 = django
     * 3 = flask
     * 4 = fastapi
     */

    public String pyCompile(Map<String, Object> req, Long teamSeq) {
        int type = Integer.parseInt(req.get("type").toString());
        // 타입 이상한 거 들어오면 리턴
        if (type > 4 || type < 0) { return "Type error"; }
        String filePath = req.get("filePath").toString();
        int filePathIndex = filePath.lastIndexOf("/");
        String projectName = filePath.substring(filePathIndex+1);
        String conAndImgName = "crowstudio_" + projectName.toLowerCase() + "_" + req.get("teamSeq");
        // 퓨어파이썬일 때
        if (type == 1) {
            if (req.get("input").toString().isEmpty()) {
                String[] command = {"python3", filePath};
                System.out.println(Arrays.toString(command));
                return resultString(command);
            }
            else {
                String[] command = {"/bin/sh", "-c", "echo " + "\"" + req.get("input") + "\" | python3 "+ filePath};
                System.out.println(Arrays.toString(command));
                return resultString(command);
            }
        }
        // Django, fastapi, flask 프로젝트일 때
        else {
            // 도커파일 추가
            String dockerfile = createDockerfile(filePath, teamSeq, type);
            if (!Objects.equals(dockerfile, "SUCCESS")) { return dockerfile; }
            System.out.println("도커파일 만들기 성공! 빌드를 해보자");
        }
        // 도커 이미지 빌드
        String[] image = {"docker", "build", "-t", conAndImgName, filePath+"/"};
        String imageBuild = resultString(image);
        if (imageBuild.isEmpty()) { return "Error: Can't build docker image"; }
        System.out.println("런 해보쟈");
        // 도커 런
        String[] command = {"docker", "run", "--rm", "-d", "--name", conAndImgName, "-P", conAndImgName};
//        System.out.println(Arrays.toString(command));
        String container = resultString(command);
        if (container.isEmpty()) { return "Error: Can't run docker container"; }
        String portString = portNum(container);
        if (portString.isEmpty()) { return "Error: 런 시켰는데 컨테이너가 안돌아가서 포트를 찾을 수가 없음"; }
        // \n 전까지의 문자열에서 : 뒤에 있는 숫자만 가져오기
        String[] portList = portString.split("\n");
        System.out.println(Arrays.toString(portList));
        String[] realPort = portList[0].split(":");
        System.out.println(Arrays.toString(realPort));
        return "k7d207.p.ssafy.io:" + realPort[1];
    }

    public String pyCompileStop(Map<String, String> req) {
        String conAndImgName = "crowstudio_" + (req.get("projectName")).toLowerCase() + "_" + req.get("teamSeq");
        // 도커 컨테이너 stop
        String[] containerStop = {"docker", "stop", conAndImgName};
        String stopedCon = resultString(containerStop);
        System.out.println("멈춘 컨테이너명 : " + stopedCon);
        if (stopedCon.isEmpty() || !stopedCon.equals(conAndImgName) ) { return "Error: Can't stop conatiner " + conAndImgName; }
        
        // 도커 이미지 rmi
        String[] imageRm = {"docker", "rmi", conAndImgName};
        String rmImg = resultString(imageRm);
//        System.out.println("삭제한 이미지명 : " + rmImg);
        if (rmImg.isEmpty() || rmImg.startsWith("Error")) { return "Error: Can't remove image " + conAndImgName; }

        // 도커파일 삭제
        String BASE_URL = "/home/ubuntu/crow_data/";
        boolean deleted = fileService.deleteFile(BASE_URL+req.get("teamSeq")+"/"+req.get("projectName")+"/Dockerfile", 2, Long.parseLong(req.get("teamSeq")));
        if (!deleted) { return "Error: Can't remove Dockerfile"; }
        return "SUCCESS";
    }
}
