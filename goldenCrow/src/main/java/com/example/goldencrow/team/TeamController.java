package com.example.goldencrow.team;

import com.example.goldencrow.team.dto.TeamDto;
import com.example.goldencrow.team.dto.UserInfoListDto;
import com.example.goldencrow.user.dto.UserInfoDto;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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

    // 팀 생성 POST
    // create
    @PostMapping("/create")
    public ResponseEntity<Map<String, Long>> teamCreatePost(@RequestHeader("Authorization") String jwt,
                                                            @RequestBody Map<String, String> req) {

        // 타입이랑
        // 맵 안의 팀네임 프로젝트타입 필요함

        // 로그에 내용이 찍히는 400 or 409 : 프로젝트 생성에서 문제가 있었음
        // 내용이 안찍히는 400 or 409 : 팀 생성에서 문제가 있었음
        // 404 : 그 깃이 제대로 된 주소가 아니라서 클론을 못함

        if (req.get("teamName") == null || req.get("projectType") == null) {
            return new ResponseEntity<>(null, HttpStatus.BAD_REQUEST);
        }

        Map<String, Long> res = teamService.teamCreate(jwt, req);

        if (res == null) {
            return new ResponseEntity<>(null, HttpStatus.BAD_REQUEST);
        } else if (res.get("result") == 409) {
            return new ResponseEntity<>(null, HttpStatus.CONFLICT);
        } else if (res.get("result") == 404) {
            return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
        } else {
            return new ResponseEntity<>(res, HttpStatus.OK);
        }

    }

    // 팀 이름 수정 PUT
    // modifyName
    @PutMapping("/modify/name/{teamSeq}")
    public ResponseEntity<String> teamModifyNamePut(@RequestHeader("Authorization") String jwt, @PathVariable Long teamSeq, @RequestBody Map<String, String> req) {

        // 리더 권한 없으면 터질 예정임
        // 이전 이름과 같아도 수정함

        if (req.get("teamName") == null) {
            return new ResponseEntity<>(FAILURE, HttpStatus.BAD_REQUEST);
        }

        String teamName = req.get("teamName");

        String result = teamService.teamModifyName(jwt, teamSeq, teamName);

        if (result.equals("success")) {
            return new ResponseEntity<>(teamName, HttpStatus.OK);
        } else if (result.equals("403")) {
            return new ResponseEntity<>(FORBIDDEN, HttpStatus.FORBIDDEN);
        } else if (result.equals("409")) {
            return new ResponseEntity<>(CONFLICT, HttpStatus.CONFLICT);
        } else if (result.equals("404")) {
            return new ResponseEntity<>(NOT_FOUND, HttpStatus.NOT_FOUND);
        } else {
            return new ResponseEntity<>(FAILURE, HttpStatus.BAD_REQUEST);
        }

    }

    // 팀 깃 수정 PUT
    // modifyGit
    @PutMapping("/modify/git/{teamSeq}")
    public ResponseEntity<String> teamModifyGitPut(@RequestHeader("Authorization") String jwt, @PathVariable Long teamSeq, @RequestBody Map<String, String> req) {

        // 리더 권한 없으면 터질 예정임
        // 이전 주소과 같아도 수정함

        if (req.get("teamGit") == null) {
            return new ResponseEntity<>(FAILURE, HttpStatus.BAD_REQUEST);
        }

        String teamGit = req.get("teamGit");

        String result = teamService.teamModifyGit(jwt, teamSeq, teamGit);

        if (result.equals("success")) {
            return new ResponseEntity<>(teamGit, HttpStatus.OK);
        } else if (result.equals("403")) {
            return new ResponseEntity<>(FORBIDDEN, HttpStatus.FORBIDDEN);
        } else if (result.equals("404")) {
            return new ResponseEntity<>(NOT_FOUND, HttpStatus.NOT_FOUND);
        } else {
            return new ResponseEntity<>(FAILURE, HttpStatus.BAD_REQUEST);
        }

    }

    // 팀 프로젝트 타입 수정
    @PutMapping("/modify/type/{teamSeq}")
    public ResponseEntity<String> teamModifyTypePut(@RequestHeader("Authorization") String jwt, @PathVariable Long teamSeq, @RequestBody Map<String, String> req) {

        // 리더 권한 없으면 터질 예정임
        // 이전 타입과 같아도 수정함

        if (req.get("projectType") == null) {
            return new ResponseEntity<>(FAILURE, HttpStatus.BAD_REQUEST);
        }

        String projectType = req.get("projectType");

        String result = teamService.teamModifyType(jwt, teamSeq, projectType);

        if (result.equals("success")) {
            return new ResponseEntity<>(projectType, HttpStatus.OK);
        } else if (result.equals("403")) {
            return new ResponseEntity<>(FORBIDDEN, HttpStatus.FORBIDDEN);
        } else if (result.equals("404")) {
            return new ResponseEntity<>(NOT_FOUND, HttpStatus.NOT_FOUND);
        } else {
            return new ResponseEntity<>(FAILURE, HttpStatus.BAD_REQUEST);
        }

    }


    // 팀 삭제 DELETE
    // delete/{teamSeq}
    @DeleteMapping("/delete/{teamSeq}")
    public ResponseEntity<String> teamDelete(@RequestHeader("Authorization") String jwt, @PathVariable Long teamSeq) {

        // 리더 권한 없으면 터질 예정임
        // 이후 팀 파일과 이것저것 싹 날아감

        String result = teamService.teamDelete(jwt, teamSeq);

        if (result.equals("success")) {
            return new ResponseEntity<>(SUCCESS, HttpStatus.OK);
        } else if (result.equals("403")) {
            return new ResponseEntity<>(FORBIDDEN, HttpStatus.FORBIDDEN);
        } else if (result.equals("400")) {
            return new ResponseEntity<>(NOT_FOUND, HttpStatus.NOT_FOUND);
        } else if (result.equals("501")) {
            return new ResponseEntity<>("file delete Error", HttpStatus.OK);
        } else {
            return new ResponseEntity<>(FAILURE, HttpStatus.BAD_REQUEST);
        }

    }

    // 팀원 목록 조회 GET
    // member/{teamSeq}
    @GetMapping("/member/{teamSeq}")
    public ResponseEntity<List<UserInfoDto>> memberListGet(@RequestHeader("Authorization") String jwt, @PathVariable Long teamSeq) {

        // 우리 팀이 아니면 403
        // 그런 팀이 없으면 404

        // 내가 속한 것만 골라서 반환
        UserInfoListDto res = teamService.memberList(jwt, teamSeq);
        String result = res.getResult();

        if (result.equals("success")) {
            // 리스트가 비어있어도 잘못된 게 아니기 때문에 그건 거르지 않는다
            return new ResponseEntity<>(res.getUserInfoDtoList(), HttpStatus.OK);
        } else if (result.equals("403")) {
            return new ResponseEntity<>(null, HttpStatus.FORBIDDEN);
        } else if (result.equals("404")) {
            return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
        } else {
            return new ResponseEntity<>(null, HttpStatus.BAD_REQUEST);
        }

    }

    // 팀원 추가 PUT
    // add
    @PutMapping("/add")
    public ResponseEntity<String> memberAddPut(@RequestHeader("Authorization") String jwt, @RequestBody Map<String, Long> req) {

        // 리더 권한 없으면 터질 예정임
        // 이미 팀 내 유저면 터질 예정임

        if (req.get("teamSeq") == null || req.get("memberSeq") == null) {
            return new ResponseEntity<>(FAILURE, HttpStatus.BAD_REQUEST);
        }

        String result = teamService.memberAdd(jwt, req.get("teamSeq"), req.get("memberSeq"));

        if (result.equals("success")) {
            return new ResponseEntity<>(SUCCESS, HttpStatus.OK);
        } else if (result.equals("403")) {
            return new ResponseEntity<>(FORBIDDEN, HttpStatus.FORBIDDEN);
        } else if (result.equals("404")) {
            return new ResponseEntity<>(NOT_FOUND, HttpStatus.NOT_FOUND);
        } else if (result.equals("409")) {
            return new ResponseEntity<>(CONFLICT, HttpStatus.CONFLICT);
        } else {
            return new ResponseEntity<>(FAILURE, HttpStatus.BAD_REQUEST);
        }
    }

    // 팀원 삭제 DELETE
    // remove
    @DeleteMapping("/remove")
    public ResponseEntity<String> memberRemoveDelete(@RequestHeader("Authorization") String jwt, @RequestBody Map<String, Long> req) {

        // 리더 권한 없으면 터질 예정임 403
        // 팀 내 유저가 아니면 터질 예정임 409
        // 스스로는 내보낼 수 없음 409
        // 그런 팀 없음 404

        if (req.get("teamSeq") == null || req.get("memberSeq") == null) {
            return new ResponseEntity<>(FAILURE, HttpStatus.BAD_REQUEST);
        }

        String result = teamService.memberRemove(jwt, req.get("teamSeq"), req.get("memberSeq"));

        if (result.equals("success")) {
            return new ResponseEntity<>(SUCCESS, HttpStatus.OK);
        } else if (result.equals("403")) {
            return new ResponseEntity<>(FORBIDDEN, HttpStatus.FORBIDDEN);
        } else if (result.equals("404")) {
            return new ResponseEntity<>(NOT_FOUND, HttpStatus.NOT_FOUND);
        } else if (result.equals("409")) {
            return new ResponseEntity<>(CONFLICT, HttpStatus.CONFLICT);
        } else {
            return new ResponseEntity<>(FAILURE, HttpStatus.BAD_REQUEST);
        }

    }

    // 팀장 위임 PUT
    // beLeader
    @PutMapping("/beLeader")
    public ResponseEntity<String> memberBeLeaderPut(@RequestHeader("Authorization") String jwt, @RequestBody Map<String, Long> req) {

        // 리더 권한 없으면 터질 예정임 403
        // 팀 내 유저가 아니면 터질 예정임 409
        // 스스로는 팀장으로 바꿀 수 없다 409
        // 그런 팀 없음 404

        if (req.get("teamSeq") == null || req.get("memberSeq") == null) {
            return new ResponseEntity<>(FAILURE, HttpStatus.BAD_REQUEST);
        }

        String result = teamService.memberBeLeader(jwt, req.get("teamSeq"), req.get("memberSeq"));

        if (result.equals("success")) {
            return new ResponseEntity<>(SUCCESS, HttpStatus.OK);
        } else if (result.equals("403")) {
            return new ResponseEntity<>(FORBIDDEN, HttpStatus.FORBIDDEN);
        } else if (result.equals("404")) {
            return new ResponseEntity<>(NOT_FOUND, HttpStatus.NOT_FOUND);
        } else if (result.equals("409")) {
            return new ResponseEntity<>(CONFLICT, HttpStatus.CONFLICT);
        } else {
            return new ResponseEntity<>(FAILURE, HttpStatus.BAD_REQUEST);
        }

    }

    // 팀 탈퇴 DELETE
    // quit/{teamSeq}
    @DeleteMapping("/quit/{teamSeq}")
    public ResponseEntity<String> memberQuitDelete(@RequestHeader("Authorization") String jwt, @PathVariable Long teamSeq) {

        // 리더면 못 나갈 예정임 403 감히
        // 원래 내 팀이 아님 409
        // 그런 팀이 없음 404

        String result = teamService.memberQuit(jwt, teamSeq);

        if (result.equals("success")) {
            return new ResponseEntity<>(SUCCESS, HttpStatus.OK);
        } else if (result.equals("403")) {
            return new ResponseEntity<>(FORBIDDEN, HttpStatus.FORBIDDEN);
        } else if (result.equals("404")) {
            return new ResponseEntity<>(NOT_FOUND, HttpStatus.NOT_FOUND);
        } else if (result.equals("409")) {
            return new ResponseEntity<>(CONFLICT, HttpStatus.CONFLICT);
        } else {
            return new ResponseEntity<>(FAILURE, HttpStatus.BAD_REQUEST);
        }

    }

}
