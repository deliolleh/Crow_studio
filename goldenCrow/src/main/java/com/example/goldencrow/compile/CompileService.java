package com.example.goldencrow.compile;

import com.example.goldencrow.file.service.FileService;
import com.example.goldencrow.team.entity.TeamEntity;
import com.example.goldencrow.team.repository.TeamRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.*;
import java.util.*;

import static com.example.goldencrow.common.Constants.*;

/**
 * 컴파일과 관련된 로직을 처리하는 서비스
 */
@Service
public class CompileService {

    @Autowired
    private FileService fileService;

    @Autowired
    private TeamRepository teamRepository;

    /**
     * 명령어를 linux bash에 입력, 출력된 내용을 반환하는 내부 로직
     *
     * @param cmd 명령어
     * @return 명령어 수행 성공 시 결과 문자열 반환, 성패에 따른 result 반환
     */
    public String resultString(String[] cmd) {
        try {
            StringBuffer sb = new StringBuffer();
            Process p = Runtime.getRuntime().exec(cmd);
            BufferedReader in = new BufferedReader(new InputStreamReader(p.getInputStream()));
            String result = "";
            String cl;
            while ((cl = in.readLine()) != null) {
                sb.append(cl);
                sb.append("\n");
            }
            result = sb.toString();
            p.waitFor();
            in.close();
            p.destroy();
            return result.trim();
        } catch (IOException | InterruptedException e) {
            return WRONG;
        }
    }

    /**
     * 각 프로젝트 종류에 따라 도커파일을 생성하는 내부 로직
     *
     * @param absolutePath 도커파일을 생성하려는 절대 경로
     * @param teamSeq  도커파일을 생성하려는 프로젝트의 팀 sequence
     * @param type     프로젝트의 타입 번호 (1: pure python, 2: django, 3: flask, 4: fastapi)
     * @return 성패에 따른 result 반환
     */
    public String createDockerfile(String absolutePath, Long teamSeq, int type) {
        // teamSeq가 DB에 존재하는지 체크
        Optional<TeamEntity> existTeam = teamRepository.findByTeamSeq(teamSeq);
        if (!existTeam.isPresent()) {
            return NO_SUCH;
        }
        // teamSeq랑 filePath에 있는 숫자랑 같은지 체크
        String[] pathList = absolutePath.split("/");
        String projectName = pathList[4];
        String content = "";
        // 2 : Django, 3 : Flask, 4 : FastAPI
        if (type == 2) {
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
        File file = new File(absolutePath + "/Dockerfile");
        try (FileWriter overWriteFile = new FileWriter(file, false)) {
            overWriteFile.write(content);
        } catch (IOException e) {
            return UNKNOWN;
        }
        return SUCCESS;
    }

    // 해당 컨테이너 포트 찾기
    /**
     * 컨테이너 Id로 사용중인 포트 번호를 찾는 내부 로직
     *
     * @param container 포트를 찾으려는 컨테이너 Id
     * @return 명령어를 수행하고 나온 출력값 반환
     */
    public String portNum(String container) {
        // linux bash에서 포트 번호를 검색하는 명령어
        String[] command = {"docker", "port", container};
        String result = resultString(command);
        if (result.startsWith("Error: No such container")) {
            return NO_SUCH;
        }
        return result;
    }

    /**
     * 프로젝트 혹은 파일을 컴파일하는 내부 로직
     *
     * @param type          프로젝트의 타입 번호 (1: pure python, 2: django, 3: flask, 4: fastapi)
     * @param projectName   컴파일을 수행할 프로젝트의 이름
     * @param teamSeq       컴파일을 수행할 프로젝트 팀의 sequence
     * @param input         pure python 파일일 때 input값
     * @return              컴파일 성공 시 컴파일 결과 반환, 성패에 따른 result 반환
     */
    public Map<String, String> pyCompileService(int type, String projectName, Long teamSeq, String input) {
        Map<String, String> serviceRes = new HashMap<>();
        // 타입 이상한 거 들어오면 리턴
        if (type > 4 || type < 0) {
            serviceRes.put("result", WRONG);
            return serviceRes;
        }
        // 프로젝트명과 teamSeq로 docker container와 image 이름 생성
        String conAndImgName = "crowstudio_" + projectName.toLowerCase() + "_" + teamSeq;
        // 절대경로 생성
        String absolutePath = BASE_URL + teamSeq + "/" + projectName;
        // 1 : pure python, 2 : django, 3 : flask, 4 : fastapi
        if (type == 1) {
            String[] command;
            if (input.isEmpty()) {
                command = new String[]{"python3", absolutePath};
            } else {
                command = new String[]{"/bin/sh", "-c", "echo " + "\"" + input + "\" | python3 " + absolutePath};
            }
            String result = resultString(command);
            // 파일 경로가 틀린 경우
            if (result.contains("Errno 2")) {
                serviceRes.put("result", NO_SUCH);
                serviceRes.put("response", result);
            } else {
                serviceRes.put("result", SUCCESS);
                serviceRes.put("response", result);
            }
            return serviceRes;
        }
        // Django, fastapi, flask 프로젝트일 때
        else {
            // 도커파일 추가
            String dockerfile = createDockerfile(absolutePath, teamSeq, type);
            if (!Objects.equals(dockerfile, "SUCCESS")) {
                serviceRes.put("result", dockerfile);
                return serviceRes;
            }
        }
        // 도커 이미지 빌드
        String[] image = {"docker", "build", "-t", conAndImgName, absolutePath + "/"};
        String imageBuild = resultString(image);
        if (imageBuild.isEmpty()) {
            serviceRes.put("result", UNKNOWN);
            return serviceRes;
        }
        // 도커 런
        String[] command = {"docker", "run", "--rm", "-d", "--name", conAndImgName, "-P", conAndImgName};
        String container = resultString(command);
        // 포트번호 가져오기
        String portString = portNum(container);
        if (portString.isEmpty()) {
            serviceRes.put("result", WRONG);
            return serviceRes;
        }
        // \n 전까지의 문자열에서 : 뒤에 있는 숫자만 가져오기
        String[] portList = portString.split("\n");
        String[] containerPort = portList[0].split(":");
        // 서버 URL 생성
        String response = "k7d207.p.ssafy.io:" + containerPort[1];
        serviceRes.put("result", SUCCESS);
        serviceRes.put("response", response);
        return serviceRes;
    }

    /**
     *
     * @param projectName   컴파일 중단할 프로젝트의 이름
     * @param teamSeq       컴파일 중단할 프로젝트의 팀 sequence
     * @return              성패에 따른 result 반환
     */
    public Map<String, String> pyCompileStopService(String projectName, String teamSeq) {
        String conAndImgName = "crowstudio_" + projectName.toLowerCase() + "_" + teamSeq;
        // 도커 컨테이너 멈추고 삭제
        String[] containerStop = {"docker", "stop", conAndImgName};
        Map<String, String> serviceRes = new HashMap<>();
        String stopedCon = resultString(containerStop);
        // 컨테이너가 없는 경우
        if (stopedCon.equals("No such container")) {
            serviceRes.put("result", NO_SUCH);
            return serviceRes;
        } else if (!stopedCon.equals(conAndImgName)) {
            serviceRes.put("result", UNKNOWN);
            return serviceRes;
        }

        // 도커 이미지 삭제
        String[] imageRm = {"docker", "rmi", conAndImgName};
        String rmImg = resultString(imageRm);
        // 이미지가 없는 경우
        if (rmImg.contains("No such image")) {
            serviceRes.put("result", NO_SUCH);
            return serviceRes;
        } else if (rmImg.startsWith("Error")) {
            serviceRes.put("result", UNKNOWN);
            return serviceRes;
        }

        // 도커파일 삭제
        Map<String, String> deletedFile = fileService.deleteFile(
                BASE_URL + teamSeq + "/" + projectName + "/Dockerfile", 2, Long.parseLong(teamSeq));
        if (!deletedFile.get("result").equals(SUCCESS)) {
            serviceRes.put("result", deletedFile.get("result"));
            return serviceRes;
        }
        serviceRes.put("result", SUCCESS);
        return serviceRes;
    }
}
