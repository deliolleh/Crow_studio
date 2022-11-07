package com.example.goldencrow.git;

import com.example.goldencrow.file.Service.FileService;
import com.example.goldencrow.user.JwtService;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;

@RestController
@RequestMapping(value = "/api/git")
public class GitController {

    private final JwtService jwtService;

    private final GitService gitService;

    public GitController(GitService gitService, JwtService jwtService) {
        this.gitService = gitService;
        this.jwtService = jwtService;
    }

    /**
     * 깃 클론 컨트롤러 
     * 결과과 Success가 아니라면 에러 메시지 반환
     * @param jwt
     * @param teamSeq
     * @param gitProject
     * @return
     */
    @PostMapping("/{teamSeq}")
    public String gitClone (@RequestHeader("Authorization") String jwt,@PathVariable Long teamSeq ,@RequestBody HashMap<String,String> gitProject) {
        String projectName = gitProject.get("projectName");
        String gitUrl = gitProject.get("gitUrl");

        String cloneResult = gitService.gitClone(gitUrl,teamSeq,projectName);

        if (!cloneResult.equals("Success")) {
            return cloneResult;
        }
        return "클론에 성공했습니다";
    }

    @PostMapping("/{teamSeq}/git-switch")
    public String gitSwitch (@RequestHeader("Authorization") String jwt, @PathVariable Long teamSeq, @RequestParam Integer type, @RequestBody HashMap<String, String> gitProject) {
        String switchResult = gitService.gitSwitch(teamSeq,gitProject.get("projectName"),gitProject.get("branchName"),type);
        if (!switchResult.equals("Success")) {
            return switchResult;
        }
        return "깃 스위치에 성공했습니다!";
    }

    @PostMapping("/{teamSeq}/git-commit")
    public String gitCommit(@RequestHeader("Authorization") String jwt, @RequestBody HashMap<String, String> gitFile) {
        String message = gitFile.get("message");
        String gitPath = gitFile.get("gitPath");
        String filePath = gitFile.get("filePath");
        String commitResult = gitService.gitCommit(message,gitPath,filePath);

        return commitResult;
    }

    @PostMapping("/{userSeq}/git-push")
    public String gitPush(@RequestHeader("Authorization") String jwt,@PathVariable Long userSeq, @RequestBody HashMap<String, String> gitFile) {
        String message = gitFile.get("message");
        String gitPath = gitFile.get("gitPath");
        String filePath = gitFile.get("filePath");
        String branchName = gitFile.get("branchName");
        String email = gitFile.get("email");
        String pass = gitFile.get("pass");
        String pushCheck = gitService.gitPush(branchName,message,gitPath,filePath,userSeq,email,pass);

        return pushCheck;
    }

}
