package com.example.goldencrow.git;

import com.example.goldencrow.user.service.JwtService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static com.example.goldencrow.common.Constants.*;

/**
 * Git과 관련된 기능을 처리하는 Controller
 *
 * @url /api/git
 */
@RestController
@RequestMapping(value = "/api/git")
public class GitController {

    private final JwtService jwtService;

    private final GitService gitService;

    /**
     * Git controller 생성자
     *
     * @param gitService    git 관련 로직을 처리하는 Service
     * @param jwtService    jwt 관련 로직을 처리하는 Service
     */
    public GitController(GitService gitService, JwtService jwtService) {
        this.gitService = gitService;
        this.jwtService = jwtService;
    }

    /**
     * 깃 클론 API
     *
     * @param jwt       회원가입 및 로그인 시 발급되는 access token
     * @param teamSeq   해당 프로젝트의 팀 sequence
     * @param req       "projectName", "gitUrl"를 키로 가지는 Map<String, String>
     * @return 성패에 따른 result 반환
     * @status 200, 400, 401, 404
     */
    @PostMapping("/{teamSeq}")
    public ResponseEntity<Map<String, String>> gitClonePost(@RequestHeader("Authorization") String jwt, @PathVariable Long teamSeq, @RequestBody Map<String, String> req) {
        if (req.containsKey("projectName") && req.containsKey("gitUrl")) {
            String projectName = req.get("projectName");
            String gitUrl = req.get("gitUrl");

            Map<String, String> res = gitService.gitCloneService(gitUrl, teamSeq, projectName);
            String result = res.get("result");
            switch (result) {
                case SUCCESS:
                    return new ResponseEntity<>(res, HttpStatus.OK);
                case NO_SUCH:
                    return new ResponseEntity<>(res, HttpStatus.NOT_FOUND);
                default:
                    return new ResponseEntity<>(res, HttpStatus.BAD_REQUEST);
            }
        } else {
            Map<String, String> res = new HashMap<>();
            res.put("result", BAD_REQ);
            return new ResponseEntity<>(res, HttpStatus.BAD_REQUEST);
        }

    }

    @PostMapping("/git-switch")
    public ResponseEntity<String> gitSwitch(@RequestHeader("Authorization") String jwt, @RequestParam Integer type, @RequestBody HashMap<String, String> gitProject) {
        String switchResult = gitService.gitSwitch(gitProject.get("gitPath"), gitProject.get("branchName"), type);
        if (!switchResult.equals("Success")) {
            return new ResponseEntity<>(switchResult, HttpStatus.BAD_REQUEST);
        }
        return new ResponseEntity<>("깃 스위치에 성공했습니다", HttpStatus.OK);
    }

    @PostMapping("/git-commit")
    public ResponseEntity<String> gitCommit(@RequestHeader("Authorization") String jwt, @RequestBody HashMap<String, String> gitFile) {
        String message = gitFile.get("message");
        String gitPath = gitFile.get("gitPath");
        String filePath = gitFile.get("filePath");
        String commitResult = gitService.gitCommit(message, gitPath, filePath);

        return new ResponseEntity<>(commitResult, HttpStatus.OK);
    }

    @PostMapping("/{userSeq}/git-push")
    public ResponseEntity<String> gitPush(@RequestHeader("Authorization") String jwt, @PathVariable Long userSeq, @RequestBody HashMap<String, String> gitFile) {
        String message = gitFile.get("message");
        String gitPath = gitFile.get("gitPath");
        String filePath = gitFile.get("filePath");
        String branchName = gitFile.get("branchName");

        String pushCheck = gitService.gitPush(branchName, message, gitPath, filePath, userSeq);

        return new ResponseEntity<>(pushCheck, HttpStatus.OK);
    }

    @PostMapping("/branches")
    public ResponseEntity<List<String>> getBranch(@RequestHeader("Authorization") String jwt, @RequestParam Integer type, @RequestBody HashMap<String, String> gitPath) {
        List<String> branches = gitService.getBranch(gitPath.get("gitPath"), type);
        if (branches.get(0).equals("failed!")) {
            return new ResponseEntity<>(branches, HttpStatus.BAD_REQUEST);
        } else {
            return new ResponseEntity<>(branches, HttpStatus.OK);
        }
    }

    @PostMapping("/{userSeq}/git-pull")
    public ResponseEntity<String> gitPull(@RequestHeader("Authorization") String jwt, @PathVariable Long userSeq, @RequestBody Map<String, String> gitInfo) {
        String gitPath = gitInfo.get("gitPath");
        String email = gitInfo.get("email");
        String pass = gitInfo.get("pass");
        String branchName = gitInfo.get("branchName");
        String result = gitService.gitPull(gitPath, userSeq, branchName);

        if (result.equals("성공")) {
            return new ResponseEntity<>("깃 풀 성공!", HttpStatus.OK);
        } else {
            return new ResponseEntity<>(result, HttpStatus.BAD_REQUEST);
        }
    }
}
