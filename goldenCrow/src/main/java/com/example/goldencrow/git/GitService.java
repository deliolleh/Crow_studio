package com.example.goldencrow.git;

import com.example.goldencrow.file.Service.ProjectService;
import com.example.goldencrow.team.entity.TeamEntity;
import com.example.goldencrow.team.repository.TeamRepository;
import com.example.goldencrow.user.entity.UserEntity;
import com.example.goldencrow.user.repository.UserRepository;
import com.google.cloud.storage.Acl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.BufferedReader;
import java.io.File;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class GitService {

    private ProjectService projectService;

    @Autowired
    private TeamRepository teamRepository;

    @Autowired
    private UserRepository userRepository;

    String baseUrl = "/home/ubuntu/crow_data";

    public GitService(ProjectService projectService) {
        this.projectService = projectService;
    }

    /**
     * git clone 함수
     * 팀, 프로젝트 디렉토리를 순차적으로 생성(프로젝트 서비스 함수 이용)
     * 그 후 프로젝트 디렉토리에서 클론
     * 클론한 디렉토리로 이동 후 유저 정보 입력(리더 이메일, 리더 닉네임)
     * @param url
     * @param teamSeq
     * @param projectName
     * @return
     * 
     */
    public String gitClone(String url, Long teamSeq, String projectName) {
        // 명령어 실행 시키기 위한 빌더
        ProcessBuilder command = new ProcessBuilder("git", "clone", url);

        // 팀 시퀀스 디렉토리 만들기
        String teamFolder = String.valueOf(teamSeq);
        String newFilePath = projectService.createDir("/home/ubuntu/crow_data",teamFolder);

        if (newFilePath.equals("2")) {
            return "폴더 생성에 실패했습니다";
        }

        // 프로젝트 이름 디렉토리 만들기
        String pjt = projectService.createDir(newFilePath,projectName);
        if (pjt.equals("2")) {
            return "폴더 생성에 실패했습니다";
        }
        File newProjectFolder = new File(pjt);

        
        // 프로젝트 디렉토리에서 명령어 실행
        command.directory(new File(pjt));

        try {
            command.start().waitFor();
        } catch (IOException e) {
            // 에러난다면 에러를 리턴
            return e.getMessage();
        } catch (InterruptedException e) {
            return e.getMessage();
        }

        File newFolder = newProjectFolder.listFiles()[0];
        System.out.println(newFolder.getPath());

        Optional<TeamEntity> thisTeam = teamRepository.findByTeamSeq(teamSeq);

        if (!thisTeam.isPresent()) {
            return "해당 팀이 존재하지 않습니다";
        }

        String configResult = setConfig(newFolder,thisTeam.get());
        if (!configResult.equals("Success")) {
            return configResult;
        }

        return "Success";
    }

    /**
     * 팀에서 리더의 닉네임, 이메일을 받아 git config에 등록
     * 팀과 파일을 입력받음
     * @param file
     * @param team
     * @return
     */
    public String setConfig(File file, TeamEntity team) {
        UserEntity leader = team.getTeamLeader();

        String leaderEmail = leader.getUserId();
        String leaderName = leader.getUserNickname();

        ProcessBuilder configEmail = new ProcessBuilder("git","config","user.email",leaderEmail);
        ProcessBuilder configName = new ProcessBuilder("git","config","user.name",leaderName);

        configEmail.directory(file);
        configName.directory(file);

        try {
            configEmail.start();
            configName.start();
        } catch (IOException e) {
            return e.getMessage();
        }
        return "Success";
    }

    /**
     * 깃 스위치 해주는 함수
     * @param gitPath
     * @param branchName
     * @return
     */
    public String gitSwitch(String gitPath, String branchName, Integer type) {

        File targetFile = new File(gitPath);

        ProcessBuilder command = new ProcessBuilder();

        if (type == 1) {
            command.command("git","switch",branchName);
        } else {
            command.command("git","switch","-c",branchName);
        }

        command.directory(targetFile);

        try {
            command.start();
        } catch (IOException e) {
            return e.getMessage();
        }

        return "Success";
    }

    /**
     * git add 함수
     * @param gitPath
     * @param filePath
     * @return
     */
    public String gitAdd(String gitPath, String filePath) {
        ProcessBuilder command = new ProcessBuilder();

        // filePath를 입력했다면, 해당 파일만 add 아니라면 "."
        if (filePath.equals("all")) {
            command.command("git","add",".");
        } else {
            command.command("git","add",filePath);
        }
        command.directory(new File(gitPath));

        try {
            Process p = command.start();
            String forPrint;
            BufferedReader br = new BufferedReader(new InputStreamReader(p.getInputStream()));
            while ((forPrint = br.readLine()) != null) {
                System.out.println(forPrint);
            }
            p.waitFor();
        } catch (IOException e) {
            return e.getMessage();
        } catch (InterruptedException e) {
            return e.getMessage();
        }
        System.out.println("add 성공!");
        return "Success";
    }

    /**
     * 깃 커밋 함수
     * 깃 애드 후 성공한다면 깃 커밋
     * @param message
     * @param gitPath
     * @param filePath
     * @return
     */
    public String gitCommit(String message, String gitPath, String filePath) {
        String check = gitAdd(gitPath,filePath);

        if (!check.equals("Success")) {
            return check;
        }

        ProcessBuilder command = new ProcessBuilder("git","commit","-m",message);
        command.directory(new File(gitPath));

        try {
            command.start().waitFor();
        } catch (IOException e) {
            return e.getMessage();
        } catch (InterruptedException e) {
            return e.getMessage();
        }
        System.out.println("커밋 성공!");
        return "Success";
    }

    /**
     * 깃 푸쉬 함수
     * 깃 커밋 후 성공한다면 푸쉬함.
     * @param branchName
     * @param message
     * @param gitPath
     * @param filePath
     * @return
     */
    public String gitPush(String branchName, String message, String gitPath, String filePath, Long userSeq, String email, String pass) {
        String check = gitCommit(message,gitPath,filePath);
        if (!check.equals("Success")) {
            return check;
        }

        ProcessBuilder command = new ProcessBuilder("git","push","origin",branchName);
        command.directory(new File(gitPath));

        try {
            System.out.println("여기야 여기");
            Process p = command.start();
            String forPrint;
            BufferedReader br = new BufferedReader(new InputStreamReader(p.getInputStream()));
            while ((forPrint = br.readLine()) != null) {
                System.out.println(forPrint);
            }
            p.waitFor();
        } catch (IOException e) {
            return e.getMessage();
        } catch (InterruptedException e) {
            return e.getMessage();
        }

//        UserEntity user = userRepository.findByUserSeq(userSeq);
//        String email = user.getUserGitId();
//        String pass = user.getUserPassWord();

        ProcessBuilder setEmail = new ProcessBuilder(email);

        try {
            setEmail.start().waitFor();;
        } catch (IOException e) {
            return e.getMessage();
        } catch (InterruptedException e) {
            return e.getMessage();
        }

        ProcessBuilder setPass = new ProcessBuilder(pass);

        try {
            setPass.start().waitFor();
        } catch (IOException e) {
            return e.getMessage();
        } catch (InterruptedException e) {
            return e.getMessage();
        }

        return "Success";
    }

    /**
     * 브랜치를 보여주는 함수
     * 타입 1은 로컬만 
     * 타입 2는 전체 브랜치 조회
     * @param gitPath
     * @param type
     * @return
     */
    public List<String> getBranch(String gitPath, Integer type) {
        List<String> branches = new ArrayList<>();
        ProcessBuilder command = new ProcessBuilder();

        if (type == 1) {
            command.command("git","branch");
        } else if (type == 2){
            command.command("git","branch","-r");
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

            branches.add("failed!");
            branches.add(e.getMessage());
            return branches;

        }
        return branches;
    }
}
