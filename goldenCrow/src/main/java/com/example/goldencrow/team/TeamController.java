package com.example.goldencrow.team;

import com.example.goldencrow.team.dto.TeamDto;
import com.example.goldencrow.team.dto.UserInfoListDto;
import com.example.goldencrow.user.dto.UserInfoDto;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static com.example.goldencrow.common.Constants.*;

/**
 * 팀과 관련된 입출력을 처리하는 controller
 *
 * @url /api/teams
 */
@RestController
@RequestMapping(value = "/api/teams")
public class TeamController {

    private final TeamService teamService;

    /**
     * TeamController 생성자
     *
     * @param teamService team을 관리하는 service
     */
    public TeamController(TeamService teamService) {
        this.teamService = teamService;
    }

    /**
     * 사용자가 속한 팀 목록을 조회하는 API
     *
     * @param jwt 회원가입 및 로그인 시 발급되는 access token
     * @return 조회 성공 시 사용자가 속한 팀의 리스트를 반환
     * @status 200, 400, 401, 404
     */
    @GetMapping("")
    public ResponseEntity<List<TeamDto>> teamListGet(@RequestHeader("Authorization") String jwt) {

        List<TeamDto> listTeamDto = teamService.teamListService(jwt);

        if (listTeamDto == null) {
            return new ResponseEntity<>(null, HttpStatus.BAD_REQUEST);
        } else {
            return new ResponseEntity<>(listTeamDto, HttpStatus.OK);
        }

    }

    /**
     * 팀의 세부 정보를 조회하는 API
     *
     * @param jwt     회원가입 및 로그인 시 발급되는 access token
     * @param teamSeq 조회하고자 하는 팀의 Seq
     * @return 조회 성공 시 해당 팀의 정보를 반환
     * @status 200, 400, 401, 403, 404
     */
    @GetMapping("/{teamSeq}")
    public ResponseEntity<TeamDto> teamGet(@RequestHeader("Authorization") String jwt, @PathVariable Long teamSeq) {

        TeamDto teamDto = teamService.teamGetService(jwt, teamSeq);
        String result = teamDto.getResult();

        switch (result) {
            case SUCCESS:
                return new ResponseEntity<>(teamDto, HttpStatus.OK);
            case NO_PER:
                return new ResponseEntity<>(teamDto, HttpStatus.FORBIDDEN);
            case NO_SUCH:
                return new ResponseEntity<>(teamDto, HttpStatus.NOT_FOUND);
            default:
                return new ResponseEntity<>(teamDto, HttpStatus.BAD_REQUEST);
        }

    }

    /**
     * 팀을 생성하는 API
     *
     * @param jwt 회원가입 및 로그인 시 발급되는 access token
     * @param req "teamName", "projectType", "projectGit"을 key로 가지는 Map<String, String>
     * @return 성패에 따른 result 반환
     * @status 200, 400, 401, 404, 409
     */
    @PostMapping("/create")
    public ResponseEntity<Map<String, String>> teamCreatePost(@RequestHeader("Authorization") String jwt,
                                                            @RequestBody Map<String, String> req) {

        if(req.containsKey("teamName")&&req.containsKey("projectType")&& req.containsKey("projectGit")) {

            String teamName = req.get("teamName");
            String projectType = req.get("projectType");
            String projectGit = req.get("projectGit");

            Map<String, String> res = teamService.teamCreateService(jwt, teamName, projectType, projectGit);
            String result = res.get("result");

            switch (result) {
                case SUCCESS:
                    return new ResponseEntity<>(res, HttpStatus.OK);
                case NO_SUCH:
                    return new ResponseEntity<>(res, HttpStatus.NOT_FOUND);
                case DUPLICATE:
                    return new ResponseEntity<>(res, HttpStatus.CONFLICT);
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
     * 팀명을 수정하는 API
     *
     * @param jwt 회원가입 및 로그인 시 발급되는 access token
     * @param teamSeq 팀명을 바꾸고자 하는 팀의 Seq
     * @param req "teamName"을 key로 가지는 Map<String, String>
     * @return 성공 시 수정된 팀명 반환, 성패에 따른 result 반환
     * @status 200, 400, 401, 403, 404, 409
     */
    @PutMapping("/modify/name/{teamSeq}")
    public ResponseEntity<Map<String, String>> teamModifyNamePut(@RequestHeader("Authorization") String jwt,
                                                    @PathVariable Long teamSeq, @RequestBody Map<String, String> req) {

        if(req.containsKey("teamName")) {

            String teamName = req.get("teamName");

            Map<String, String> res = teamService.teamModifyNameService(jwt, teamSeq, teamName);
            String result = res.get("result");

            switch (result) {
                case SUCCESS:
                    return new ResponseEntity<>(res, HttpStatus.OK);
                case NO_PER:
                    return new ResponseEntity<>(res, HttpStatus.FORBIDDEN);
                case NO_SUCH:
                    return new ResponseEntity<>(res, HttpStatus.NOT_FOUND);
                case DUPLICATE:
                    return new ResponseEntity<>(res, HttpStatus.CONFLICT);
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
     * 팀의 Git을 수정하는 API
     *
     * @param jwt 회원가입 및 로그인 시 발급되는 access token
     * @param teamSeq Git을 바꾸고자 하는 팀의 Seq
     * @param req "teamGit"을 key로 가지는 Map<String, String>
     * @return 성공 시 수정된 Git 주소 반환, 성패에 따른 result 반환
     * @status 200, 400, 401, 403, 404
     */
    @PutMapping("/modify/git/{teamSeq}")
    public ResponseEntity<Map<String, String>> teamModifyGitPut(@RequestHeader("Authorization") String jwt,
                                                   @PathVariable Long teamSeq, @RequestBody Map<String, String> req) {

        if(req.containsKey("teamGit")) {

            String teamGit = req.get("teamGit");

            Map<String, String> res = teamService.teamModifyGitService(jwt, teamSeq, teamGit);
            String result = res.get("result");

            switch (result) {
                case SUCCESS:
                    return new ResponseEntity<>(res, HttpStatus.OK);
                case NO_PER:
                    return new ResponseEntity<>(res, HttpStatus.FORBIDDEN);
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
     * 팀의 프로젝트 타입을 수정하는 API
     *
     * @param jwt 회원가입 및 로그인 시 발급되는 access token
     * @param teamSeq 프로젝트 타입을 바꾸고자 하는 팀의 Seq
     * @param req "projectType"을 key로 가지는 Map<String, String>
     * @return 성공 시 수정된 프로젝트 타입 반환, 성패에 따른 result 반환
     * @status 200, 400, 401, 403, 404
     */
    @PutMapping("/modify/type/{teamSeq}")
    public ResponseEntity<Map<String, String>> teamModifyTypePut(@RequestHeader("Authorization") String jwt,
                                                    @PathVariable Long teamSeq, @RequestBody Map<String, String> req) {

        if(req.containsKey("projectType")) {

            String projectType = req.get("projectType");

            Map<String, String> res = teamService.teamModifyTypeService(jwt, teamSeq, projectType);
            String result = res.get("result");

            switch (result) {
                case SUCCESS:
                    return new ResponseEntity<>(res, HttpStatus.OK);
                case NO_PER:
                    return new ResponseEntity<>(res, HttpStatus.FORBIDDEN);
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
     * 팀을 삭제하는 API
     *
     * @param jwt 회원가입 및 로그인 시 발급되는 access token
     * @param teamSeq 삭제하고자 하는 팀의 Seq
     * @return 성패에 따른 result 반환
     * @status 200, 400, 401, 403, 404
     */
    @DeleteMapping("/delete/{teamSeq}")
    public ResponseEntity<Map<String, String>> teamDelete(@RequestHeader("Authorization") String jwt,
                                                          @PathVariable Long teamSeq) {

            Map<String, String> res = teamService.teamDeleteService(jwt, teamSeq);
            String result = res.get("result");

            switch (result) {
                case SUCCESS:
                    return new ResponseEntity<>(res, HttpStatus.OK);
                case NO_PER:
                    return new ResponseEntity<>(res, HttpStatus.FORBIDDEN);
                case NO_SUCH:
                    return new ResponseEntity<>(res, HttpStatus.NOT_FOUND);
                default:
                    return new ResponseEntity<>(res, HttpStatus.BAD_REQUEST);
            }

    }

    /**
     * 팀의 팀원 목록을 조회하는 API
     *
     * @param jwt 회원가입 및 로그인 시 발급되는 access token
     * @param teamSeq 조회하고자 하는 팀의 Seq
     * @return 팀의 팀원 목록 리스트 반환
     * @status 200, 400, 401, 403, 404
     */
    @GetMapping("/member/{teamSeq}")
    public ResponseEntity<List<UserInfoDto>> memberListGet(@RequestHeader("Authorization") String jwt,
                                                           @PathVariable Long teamSeq) {

        UserInfoListDto res = teamService.memberListService(jwt, teamSeq);
        String result = res.getResult();

        switch (result) {
            case SUCCESS:
                return new ResponseEntity<>(res.getUserInfoDtoList(), HttpStatus.OK);
            case NO_PER:
                return new ResponseEntity<>(new ArrayList<>(), HttpStatus.FORBIDDEN);
            case NO_SUCH:
                return new ResponseEntity<>(new ArrayList<>(), HttpStatus.NOT_FOUND);
            default:
                return new ResponseEntity<>(new ArrayList<>(), HttpStatus.BAD_REQUEST);
        }

    }

//    // 팀원 추가 PUT
//    // add
//    @PutMapping("/add")
//    public ResponseEntity<String> memberAddPut(@RequestHeader("Authorization") String jwt, @RequestBody Map<String, Long> req) {
//
//        // 리더 권한 없으면 터질 예정임
//        // 이미 팀 내 유저면 터질 예정임
//
//        if (req.get("teamSeq") == null || req.get("memberSeq") == null) {
//            return new ResponseEntity<>(FAILURE, HttpStatus.BAD_REQUEST);
//        }
//
//        String result = teamService.memberAdd(jwt, req.get("teamSeq"), req.get("memberSeq"));
//
//        if (result.equals("success")) {
//            return new ResponseEntity<>(SUCCESS, HttpStatus.OK);
//        } else if (result.equals("403")) {
//            return new ResponseEntity<>(FORBIDDEN, HttpStatus.FORBIDDEN);
//        } else if (result.equals("404")) {
//            return new ResponseEntity<>(NOT_FOUND, HttpStatus.NOT_FOUND);
//        } else if (result.equals("409")) {
//            return new ResponseEntity<>(CONFLICT, HttpStatus.CONFLICT);
//        } else {
//            return new ResponseEntity<>(FAILURE, HttpStatus.BAD_REQUEST);
//        }
//    }
//
//    // 팀원 삭제 DELETE
//    // remove
//    @DeleteMapping("/remove")
//    public ResponseEntity<String> memberRemoveDelete(@RequestHeader("Authorization") String jwt, @RequestBody Map<String, Long> req) {
//
//        // 리더 권한 없으면 터질 예정임 403
//        // 팀 내 유저가 아니면 터질 예정임 409
//        // 스스로는 내보낼 수 없음 409
//        // 그런 팀 없음 404
//
//        if (req.get("teamSeq") == null || req.get("memberSeq") == null) {
//            return new ResponseEntity<>(FAILURE, HttpStatus.BAD_REQUEST);
//        }
//
//        String result = teamService.memberRemove(jwt, req.get("teamSeq"), req.get("memberSeq"));
//
//        if (result.equals("success")) {
//            return new ResponseEntity<>(SUCCESS, HttpStatus.OK);
//        } else if (result.equals("403")) {
//            return new ResponseEntity<>(FORBIDDEN, HttpStatus.FORBIDDEN);
//        } else if (result.equals("404")) {
//            return new ResponseEntity<>(NOT_FOUND, HttpStatus.NOT_FOUND);
//        } else if (result.equals("409")) {
//            return new ResponseEntity<>(CONFLICT, HttpStatus.CONFLICT);
//        } else {
//            return new ResponseEntity<>(FAILURE, HttpStatus.BAD_REQUEST);
//        }
//
//    }
//
//    // 팀장 위임 PUT
//    // 지금 안쓴다
//    // beLeader
//    @PutMapping("/beLeader")
//    public ResponseEntity<String> memberBeLeaderPut(@RequestHeader("Authorization") String jwt, @RequestBody Map<String, Long> req) {
//
//        // 리더 권한 없으면 터질 예정임 403
//        // 팀 내 유저가 아니면 터질 예정임 409
//        // 스스로는 팀장으로 바꿀 수 없다 409
//        // 그런 팀 없음 404
//
//        if (req.get("teamSeq") == null || req.get("memberSeq") == null) {
//            return new ResponseEntity<>(FAILURE, HttpStatus.BAD_REQUEST);
//        }
//
//        String result = teamService.memberBeLeader(jwt, req.get("teamSeq"), req.get("memberSeq"));
//
//        if (result.equals("success")) {
//            return new ResponseEntity<>(SUCCESS, HttpStatus.OK);
//        } else if (result.equals("403")) {
//            return new ResponseEntity<>(FORBIDDEN, HttpStatus.FORBIDDEN);
//        } else if (result.equals("404")) {
//            return new ResponseEntity<>(NOT_FOUND, HttpStatus.NOT_FOUND);
//        } else if (result.equals("409")) {
//            return new ResponseEntity<>(CONFLICT, HttpStatus.CONFLICT);
//        } else {
//            return new ResponseEntity<>(FAILURE, HttpStatus.BAD_REQUEST);
//        }
//
//    }
//
//    // 팀 탈퇴 DELETE
//    // quit/{teamSeq}
//    @DeleteMapping("/quit/{teamSeq}")
//    public ResponseEntity<String> memberQuitDelete(@RequestHeader("Authorization") String jwt, @PathVariable Long teamSeq) {
//
//        // 리더면 못 나갈 예정임 403 감히
//        // 원래 내 팀이 아님 409
//        // 그런 팀이 없음 404
//
//        String result = teamService.memberQuit(jwt, teamSeq);
//
//        if (result.equals("success")) {
//            return new ResponseEntity<>(SUCCESS, HttpStatus.OK);
//        } else if (result.equals("403")) {
//            return new ResponseEntity<>(FORBIDDEN, HttpStatus.FORBIDDEN);
//        } else if (result.equals("404")) {
//            return new ResponseEntity<>(NOT_FOUND, HttpStatus.NOT_FOUND);
//        } else if (result.equals("409")) {
//            return new ResponseEntity<>(CONFLICT, HttpStatus.CONFLICT);
//        } else {
//            return new ResponseEntity<>(FAILURE, HttpStatus.BAD_REQUEST);
//        }
//
//    }

}
