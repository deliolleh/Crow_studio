package com.example.goldencrow.git;

import com.example.goldencrow.file.Service.ProjectService;
import com.example.goldencrow.team.entity.TeamEntity;
import com.example.goldencrow.team.repository.TeamRepository;
import com.example.goldencrow.user.entity.UserEntity;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.File;
import java.io.IOException;
import java.util.Optional;

@Service
public class GitService {

    private ProjectService projectService;

    @Autowired
    private TeamRepository teamRepository;

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
            command.start();
        } catch (IOException e) {
            // 에러난다면 에러를 리턴
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
     * 팀과 파일을 입력받음
     * 팀에서 리더의 닉네임, 이메일을 받아 git config에 등록
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
}
