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
     * @param gitService git 관련 로직을 처리하는 Service
     * @param jwtService jwt 관련 로직을 처리하는 Service
     */
    public GitController(GitService gitService, JwtService jwtService) {
        this.gitService = gitService;
        this.jwtService = jwtService;
    }

    /**
     * Git Clone API
     * access token 필요
     *
     * @param teamSeq 해당 프로젝트의 팀 sequence
     * @param req     "projectName", "gitUrl"를 key로 가지는 Map<String, String>
     * @return 성패에 따른 result 반환
     * @status 200, 400, 401, 404
     */
    @PostMapping("/{teamSeq}")
    public ResponseEntity<Map<String, String>> gitClonePost(@PathVariable Long teamSeq,
                                                            @RequestBody Map<String, String> req) {
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
                case NO_PER:
                    return new ResponseEntity<>(res,HttpStatus.FORBIDDEN);
                default:
                    return new ResponseEntity<>(res, HttpStatus.BAD_REQUEST);
            }
        } else {
            Map<String, String> res = new HashMap<>();
            res.put("result", BAD_REQ);
            return new ResponseEntity<>(res, HttpStatus.BAD_REQUEST);
        }

    }

    /**
     * Git Switch API
     * access token 필요
     *
     * @param type switch할 branch의 종류 (1 : 존재하는 브랜치로 이동, 2 : 브랜치를 새로 생성 후 이동)
     * @param req  "gitPath", "branchName"를 key로 가지는 Map<String, String>
     * @return 성패에 따른 result 반환
     * @status 200, 400, 401, 404
     */
    @PostMapping("/{teamSeq}/git-switch")
    public ResponseEntity<Map<String, String>> gitSwitchPost(@PathVariable Long teamSeq,
                                                             @RequestParam Integer type,
                                                             @RequestBody Map<String, String> req) {
        if ( req.containsKey("branchName")) {
            String gitPath = req.get("gitPath");
            String branchName = req.get("branchName");
            Map<String, String> res = gitService.gitSwitchService(branchName, type, teamSeq);
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

    /**
     * Git Commit API
     * access token 필요
     *
     * @param req "message", "gitPath", "filePath"를 key로 가지는 Map<String, String>
     * @return 성패에 따른 result 반환
     * @status 200, 400, 401, 404
     */
    @PostMapping("/git-commit")
    public ResponseEntity<Map<String, String>> gitCommitPost(@RequestBody Map<String, String> req) {
        if (req.containsKey("message") && req.containsKey("gitPath") && req.containsKey("filePath")) {
            String message = req.get("message");
            String gitPath = req.get("gitPath");
            String filePath = req.get("filePath");
            Map<String, String> res = gitService.gitCommitService(message, gitPath, filePath);
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

    /**
     * Git Push API
     * access token 필요
     *
     * @param userSeq push하는 사용자의 Sequence
     * @param req     "message", "gitPath", "filePath", "branchName"을 key로 가지는 Map<String, String>
     * @return 성패에 따른 result 반환
     * @status 200, 400, 401, 404
     */
    @PostMapping("/{userSeq}/git-push")
    public ResponseEntity<Map<String, String>> gitPushPost(@PathVariable Long userSeq,
                                                           @RequestBody HashMap<String, String> req) {
        if (req.containsKey("message") && req.containsKey("gitPath")
                && req.containsKey("filePath") && req.containsKey("branchName")) {
            String message = req.get("message");
            String gitPath = req.get("gitPath");
            String filePath = req.get("filePath");
            String branchName = req.get("branchName");
            Map<String, String> res = gitService.gitPushService(branchName, message, gitPath, filePath, userSeq);
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

    /**
     * Git branch 목록을 조회하는 API
     * access token 필요
     *
     * @param type 조회하려는 브랜치의 종류 (1 : local branch, 2 : remote branch)
     * @param req  "gitPath"를 key로 가지는 Map<String, String>
     * @return branch 목록을 List<String>으로 반환, 없으면 null
     * @status 200, 400, 401
     */
    @PostMapping("/branches")
    public ResponseEntity<List<String>> getBranchPost(@RequestParam Integer type,
                                                      @RequestBody HashMap<String, String> req) {
        if (req.containsKey("gitPath")) {
            String gitPath = BASE_URL + req.get("gitPath");
            List<String> res = gitService.getBranchService(gitPath, type);

            if (res != null) {
                return new ResponseEntity<>(res, HttpStatus.OK);
            }
            return new ResponseEntity<>(res, HttpStatus.BAD_REQUEST);
        } else {
            return new ResponseEntity<>(null, HttpStatus.BAD_REQUEST);
        }
    }

    /**
     * Git Pull API
     * access token 필요
     *
     * @param userSeq pull하는 사용자의 Sequence
     * @param req     "gitPath", "branchName"를 key로 가지는 Map<String, String>
     * @return 성패에 따른 result 반환
     * @status 200, 400, 401, 404
     */
    @PostMapping("/{userSeq}/git-pull")
    public ResponseEntity<Map<String, String>> gitPullPost(@PathVariable Long userSeq,
                                                           @RequestBody Map<String, String> req) {
        if (req.containsKey("gitPath") && req.containsKey("branchName")) {
            String gitPath = req.get("gitPath");
            String branchName = req.get("branchName");
            Map<String, String> res = gitService.gitPullService(gitPath, userSeq, branchName);
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
}
