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
}
