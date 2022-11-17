package com.example.goldencrow.git;

import com.example.goldencrow.file.service.ProjectService;
import com.example.goldencrow.team.entity.TeamEntity;
import com.example.goldencrow.team.repository.TeamRepository;
import com.example.goldencrow.user.UserEntity;

import com.example.goldencrow.user.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.*;
import java.util.*;

import static com.example.goldencrow.common.Constants.*;

/**
 * git과 관련된 로직을 처리하는 service
 */
@Service
public class GitService {

    private final ProjectService projectService;

    private ProcessBuilder command;
    @Autowired
    private TeamRepository teamRepository;

    @Autowired
    private UserRepository userRepository;

    /**
     * Git Service 생성자
     *
     * @param projectService    project를 관리하는 service
     * @param userRepository    user Table에 접속하는 Repository
     */
    public GitService(ProjectService projectService, UserRepository userRepository) {
        this.projectService = projectService;
        this.userRepository = userRepository;
    }

    public List<String> getGitInfo(Long userSeq) {
        List<String> gitInfo = new ArrayList<>();
        String email = userRepository.getReferenceById(userSeq).getUserGitUsername();
        String token = userRepository.getReferenceById(userSeq).getUserGitToken();

        gitInfo.add("깃 정보가 없습니다.");
        if (email == null || token == null) {
            return gitInfo;
        }
        gitInfo.add(email);
        gitInfo.add(token);
        return gitInfo;
    }

    /**
     * git clone 내부 로직
     * 팀, 프로젝트 디렉토리를 순차적으로 생성(프로젝트 서비스 함수 이용)
     * 그 후 프로젝트 디렉토리에서 클론
     * 클론한 디렉토리로 이동 후 유저 정보 입력(리더 이메일, 리더 닉네임)
     *
     * @param url           clone받을 git 주소
     * @param teamSeq       해당 프로젝트의 팀 sequence
     * @param projectName   해당 프로젝트명
     * @return 성패에 따른 result 반환
     */
    public Map<String, String> gitCloneService(String url, Long teamSeq, String projectName) {
        Map<String, String> serviceRes = new HashMap<>();

        // 명령어 실행 시키기 위한 ProcessBuilder
        ProcessBuilder command = new ProcessBuilder("git", "clone", url);

        // 팀 시퀀스 디렉토리 만들기
        String teamFolder = String.valueOf(teamSeq);
        String newFilePath = projectService.createDir("/home/ubuntu/crow_data", teamFolder);

        if (newFilePath.equals("2")) {
            serviceRes.put("result", WRONG);
            return serviceRes;
        }

        // 프로젝트 이름 디렉토리 만들기
        String pjt = projectService.createDir(newFilePath, projectName);
        if (pjt.equals("2")) {
            serviceRes.put("result", WRONG);
            return serviceRes;
        }
        File newProjectFolder = new File(pjt);

        // 프로젝트 디렉토리에서 명령어 실행
        command.directory(new File(pjt));
        try {
            command.start().waitFor();
        } catch (IOException e) {
            serviceRes.put("result", WRONG);
            return serviceRes;
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            serviceRes.put("result", WRONG);
            return serviceRes;
        }

        // 이부분이 무슨 부분 일 까
        if (newProjectFolder.listFiles() == null
                || Objects.requireNonNull(newProjectFolder.listFiles()).length == 0) {
            serviceRes.put("result", NO_SUCH);
            return serviceRes;
        }
        File newFolder = Objects.requireNonNull(newProjectFolder.listFiles())[0];

        // 팀시퀀스로 팀이 존재하는지 확인
        Optional<TeamEntity> thisTeam = teamRepository.findByTeamSeq(teamSeq);
        if (!thisTeam.isPresent()) {
            serviceRes.put("result", NO_SUCH);
            return serviceRes;
        }
        // config 파일 세팅
        String configResult = setConfigService(newFolder, thisTeam.get());
        if (!configResult.equals(SUCCESS)) {
            serviceRes.put("result", NO_SUCH);
            return serviceRes;
        }
        serviceRes.put("result", SUCCESS);
        return serviceRes;
    }

    /**
     * 팀에서 리더의 닉네임, 이메일을 받아 git config에 등록하는 내부 로직
     * 팀 Entity와 파일을 입력받음
     *
     * @param file  config를 등록할 파일 정보
     * @param team  config에 등록할 팀 정보
     * @return  성패에 따른 String
     */
    public String setConfigService(File file, TeamEntity team) {
        UserEntity leader = team.getTeamLeader();

        String leaderEmail = leader.getUserId();
        String leaderName = leader.getUserNickname();

        // git config에 등록하기 위해 ProcessBuilder 사용
        ProcessBuilder configEmail = new ProcessBuilder("git", "config", "user.email", leaderEmail);
        ProcessBuilder configName = new ProcessBuilder("git", "config", "user.name", leaderName);

        configEmail.directory(file);
        configName.directory(file);

        try {
            configEmail.start();
            configName.start();
        } catch (IOException e) {
            return e.getMessage();
        }
        return SUCCESS;
    }

    /**
     * Git Switch를 처리하는 내부 로직
     *
     * @param gitPath       switch할 git의 경로
     * @param branchName    switch할 brnach의 이름
     * @param type          switch할 branch의 종류 (1 : 존재하는 브랜치로 이동, 2 : 브랜치를 새로 생성 후 이동)
     * @return 성패에 따른 result 반환
     */
    public Map<String, String> gitSwitchService(String gitPath, String branchName, Integer type) {
        Map<String, String> serviceRes = new HashMap<>();
        File targetFile = new File(gitPath);

        ProcessBuilder command = new ProcessBuilder();
        // switch할 branch의 종류로 명령어 저장
        if (type == 1) {
            command.command("git", "switch", branchName);
        } else {
            command.command("git", "switch", "-c", branchName);
        }
        // 명령어를 실행할 파일 설정
        command.directory(targetFile);
        // 결과 문자열 저장하기 위한 StringBuilder
        StringBuilder msg = new StringBuilder();

        // 명령어 수행
        try {
            String result = "";
            Process p = command.start();
            BufferedReader br = new BufferedReader(new InputStreamReader(p.getInputStream()));
            while ((result = br.readLine()) != null) {
                msg.append(result).append("\n");
            }
        } catch (IOException e) {
            serviceRes.put("result", UNKNOWN);
            return serviceRes;
        }
        // 성공 여부 판단
        if (msg.length() == 0) {
            serviceRes.put("result", SUCCESS);
        } else {
            serviceRes.put("result", UNKNOWN);
        }
        return serviceRes;
    }

    /**
     * git add 함수
     *
     * @param gitPath
     * @param filePath
     * @return
     */
    public String gitAdd(String gitPath, String filePath) {
        ProcessBuilder command = new ProcessBuilder();

        // filePath를 입력했다면, 해당 파일만 add 아니라면 "."
        if (filePath.equals("all")) {
            command.command("git", "add", ".");
        } else {
            command.command("git", "add", filePath);
        }
        command.directory(new File(gitPath));
        StringBuilder msg = new StringBuilder();
        try {
            Process p = command.start();
            String forPrint;
            BufferedReader br = new BufferedReader(new InputStreamReader(p.getInputStream()));
            while ((forPrint = br.readLine()) != null) {
               msg.append(forPrint);
               msg.append("\n");
            }
            p.waitFor();
        } catch (IOException e) {
            return e.getMessage();
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            return e.getMessage();
        }

        if (msg.length() == 0) {
            return "Success";
        }
        return msg.toString();
    }

    /**
     * 깃 커밋 함수
     * 깃 애드 후 성공한다면 깃 커밋
     *
     * @param message
     * @param gitPath
     * @param filePath
     * @return
     */
    public String gitCommit(String message, String gitPath, String filePath) {
        String check = gitAdd(gitPath, filePath);

        if (!check.equals("Success")) {
            return check;
        }

        ProcessBuilder command = new ProcessBuilder("git", "commit", "-m", message);
        command.directory(new File(gitPath));
        StringBuilder msg = new StringBuilder();
        msg.append("Success");
        msg.append("\n");
        try {
            Process p = command.start();
            String forPrint;

            BufferedReader br = new BufferedReader(new InputStreamReader(p.getInputStream()));

            while ((forPrint = br.readLine()) != null) {
                msg.append(forPrint);
                msg.append("\n");
            }
            p.waitFor();
        } catch (IOException e) {
            return e.getMessage();
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            return e.getMessage();
        }
        if (msg.length() == 0) {
            return "Success";
        }
        return msg.toString();
    }

    /**
     * 깃 푸쉬 함수
     * 깃 커밋 후 성공한다면 푸쉬함.
     *
     * @param branchName
     * @param message
     * @param gitPath
     * @param filePath
     * @return
     */
    public String gitPush(String branchName, String message, String gitPath, String filePath, Long userSeq) {
        String check = gitCommit(message, gitPath, filePath);
        if (!check.contains("Success")) {
            return check;
        }

        String gitUrl = getRemoteUrl(gitPath);
        if (!gitUrl.contains("https")) {
            return "url 설정에 실패했습니다.";
        }

        List<String> gitInfo = getGitInfo(userSeq);

        if (gitInfo.size() < 2) {
            return "깃 정보가 없습니다.";
        }

        String email = gitInfo.get(0);
        String pass = gitInfo.get(1);


        String newGitUrl = newRemoteUrl(gitUrl,email,pass);

        boolean setNew = setNewUrl(newGitUrl,gitPath);


        if (!setNew) {
            return "새로운 url 설정에 실패했습니다.";
        }

        ProcessBuilder command = new ProcessBuilder("git", "push", "origin", branchName);
        command.directory(new File(gitPath));
        StringBuilder msg = new StringBuilder();
        try {
            String read = null;
            Process p = command.start();
            BufferedReader result = new BufferedReader(new InputStreamReader(p.getInputStream()));
            while ((read = result.readLine()) != null) {
                msg.append(read + "\n");
            }
        } catch (IOException e) {
            return e.getMessage();
        }

        boolean returnOld = setNewUrl(gitUrl, gitPath);

        if (!returnOld) {
            return "url 재설정에 실패했습니다.";
        }

        return msg.toString();
    }

    /**
     * 브랜치를 보여주는 함수
     * 타입 1은 로컬만
     * 타입 2는 전체 브랜치 조회
     *
     * @param gitPath
     * @param type
     * @return
     */
    public List<String> getBranch(String gitPath, Integer type) {
        List<String> branches = new ArrayList<>();
        ProcessBuilder command = new ProcessBuilder();

        if (type == 1) {
            command.command("git", "branch");
        } else if (type == 2) {
            command.command("git", "branch", "-r");
        } else {
            branches.add("failed!");
            return branches;
        }

        command.directory(new File(gitPath));
        String read;

        try {
            Process getBranch = command.start();
            BufferedReader branch = new BufferedReader(new InputStreamReader(getBranch.getInputStream()));

            while ((read = branch.readLine()) != null) {
                branches.add(read.trim());
                System.out.println(read);
            }
            getBranch.waitFor();

        } catch (IOException e) {

            branches.add("failed!");
            branches.add(e.getMessage());
            return branches;

        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            System.out.println(e.getMessage());
            branches.add("failed!");
            branches.add(e.getMessage());
            return branches;

        }
        return branches;
    }

    /**
     * 현재 연결된 깃의 URL을 받아오는 함수
     *
     * @param gitPath
     * @return remoteURL
     */
    public String getRemoteUrl(String gitPath) {
        command = new ProcessBuilder("git", "remote", "-vv");
        command.directory(new File(gitPath));
        String returnUrl = null;

        try {
            Process p = command.start();
            BufferedReader br = new BufferedReader(new InputStreamReader(p.getInputStream()));
            String reader = null;

            while ((reader = br.readLine()) != null) {
                returnUrl = reader;
                System.out.println(returnUrl);
            }
        } catch (IOException e) {
            return e.getMessage();
        }

        if (returnUrl == null) {
            return "failed";
        } else {
            returnUrl = returnUrl.replace("origin", "");
            returnUrl = returnUrl.replace("(push)", "");
            returnUrl = returnUrl.trim();
            System.out.println(returnUrl);
            return returnUrl;
        }

    }

    /**
     * 푸쉬를 하기 위한 새로운 Url을 만들어주는 함수(만들기만 하고 세팅하진 않음!)
     *
     * @param basicPath
     * @param email
     * @param pass
     * @return newUrl
     */
    public String newRemoteUrl(String basicPath, String email, String pass) {
        String id = "";
        StringBuffer sb = new StringBuffer();
        for (int i = 0; i < email.length(); i++) {
            if (String.valueOf(email.charAt(i)).equals("@")) {
                break;
            }
            sb.append(String.valueOf(email.charAt(i)));
        }
        id = sb.toString();
        System.out.println(id);
        String returnPath = basicPath.replace("https://", String.format("https://%s:%s@", id, pass));
        return returnPath;
    }

    /**
     * push / pull할 새로운 URL 세팅
     *
     * @param newUrl
     * @param gitPath
     * @return
     */
    public Boolean setNewUrl(String newUrl, String gitPath) {
        command.command("git", "remote", "set-url", "origin", newUrl);
        command.directory(new File(gitPath));

        try {
            command.start();
        } catch (IOException e) {
            System.out.println(e.getMessage());
            return false;
        }
        return true;
    }

    /**
     * 새로운 푸쉬/풀 할 수 있는 gitUrl을 설정해주는 통합 관리 함수
     *
     * @param gitPath
     * @param email
     * @param pass
     * @return msg
     */
    public String setUrl(String gitPath, String email, String pass) {
        String gitUrl = getRemoteUrl(gitPath);
        if (gitUrl.equals("failed")) {
            return "gitUrl을 받아오지 못했습니다.";
        }
        String newRemoteUrl = newRemoteUrl(gitUrl, email, pass);
        Boolean check = setNewUrl(newRemoteUrl, gitPath);
        if (!check) {
            return "gitUrl 설정에 실패했습니다";
        }
        return "성공";
    }

    public String reUrl(String oldUrl, String gitPath) {
        Boolean check = setNewUrl(oldUrl, gitPath);
        if (!check) {
            return "fail!";
        }
        return "Success";
    }

    public String gitPull(String gitPath, Long userSeq, String brachName) {
        String gitUrl = getRemoteUrl(gitPath);

        List<String> gitInfo = getGitInfo(userSeq);

        if (gitInfo.size() < 2) {
            return "깃 정보가 없습니다.";
        }

        String email = gitInfo.get(0);
        String pass = gitInfo.get(1);

        String check = setUrl(gitPath, email, pass);

        if (!check.equals("성공")) {
            return check;
        }

        ProcessBuilder pb = new ProcessBuilder("git", "pull", "origin", brachName);
        pb.directory(new File(gitPath));
        StringBuilder msg = new StringBuilder();
        try {
            String result;
            Process p = pb.start();
            BufferedReader br = new BufferedReader(new InputStreamReader(p.getInputStream()));
            while ((result = br.readLine()) != null) {
                msg.append(result);
                msg.append("\n");
            }
        } catch (IOException e) {
            return e.getMessage();
        }

        String result = reUrl(gitUrl, gitPath);

        if (msg.length() == 0) {
            return "Success";
        }

        return msg.toString();
    }

}