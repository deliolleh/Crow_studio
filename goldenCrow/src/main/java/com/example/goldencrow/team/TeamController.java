package com.example.goldencrow.team;

import com.example.goldencrow.team.dto.TeamDto;
import com.example.goldencrow.user.JwtService;
import com.example.goldencrow.user.UserService;
import com.example.goldencrow.user.dto.UserInfoDto;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping(value="/api/team")
public class TeamController {

    private final String SUCCESS = "SUCCESS";
    private final String FAILURE = "FAILURE";
    private final String FORBIDDEN = "FORBIDDEN";

    private final UserService userService;

    private final TeamService teamService;

    private final JwtService jwtService;

    public TeamController(UserService userService, TeamService teamService, JwtService jwtService) {
        this.userService = userService;
        this.teamService = teamService;
        this.jwtService = jwtService;
    }

    // 팀 목록 조회 GET
    // -
    @GetMapping("")
    public ResponseEntity<List<TeamDto>> teamListGet(@RequestHeader("jwt") String jwt){

        // 내가 속한 것만 골라서 반환
        List<TeamDto> teamDtoList = teamService.teamList(jwt);

        if(teamDtoList==null) {
            return new ResponseEntity<>(null, HttpStatus.BAD_REQUEST);
        } else {
            // 리스트가 비어있어도 잘못된 게 아니기 때문에 그건 거르지 않는다
            return new ResponseEntity<>(teamDtoList, HttpStatus.OK);
        }

    }

    // 팀 생성 POST
    // create
    @PostMapping("/create")
    public ResponseEntity<String> teamCreatePost(@RequestHeader("jwt") String jwt, @RequestBody Map<String, String> req) {

        if(req.get("teamName")==null) {
            return new ResponseEntity<>(FAILURE, HttpStatus.BAD_REQUEST);
        }

        if(teamService.teamCreate(jwt, req.get("teamName")).equals("success")) {
            return new ResponseEntity<>(SUCCESS, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(FAILURE, HttpStatus.BAD_REQUEST);
        }

    }

    // 팀 수정 PUT
    // modify
    @PutMapping("/modify/{teamSeq}")
    public ResponseEntity<String> teamModifyPut(@RequestHeader("jwt") String jwt, @PathVariable Long teamSeq, @RequestBody Map<String, String> req){

        // 리더 권한 없으면 터질 예정임
        // 이전 이름과 같아도 수정함

        if(req.get("teamName")==null){
            return new ResponseEntity<>(FAILURE, HttpStatus.BAD_REQUEST);
        }

        String result = teamService.teamModify(jwt, teamSeq, req.get("teamName"));

        if(result.equals("success")){
            return new ResponseEntity<>(SUCCESS, HttpStatus.OK);
        } else if(result.equals("403")) {
            return new ResponseEntity<>(FORBIDDEN, HttpStatus.FORBIDDEN);
        } else {
            return new ResponseEntity<>(FAILURE, HttpStatus.BAD_REQUEST);
        }

    }

    // 팀 삭제 DELETE
    // delete/{teamSeq}
    @DeleteMapping("/delete/{teamSeq}")
    public ResponseEntity<String> teamDelete(@RequestHeader("jwt") String jwt, @PathVariable Long teamSeq){

        // 리더 권한 없으면 터질 예정임
        // 이후 팀 파일과 이것저것 싹 날아감

        String result = teamService.teamDelete(jwt, teamSeq);

        if(result.equals("success")){
            return new ResponseEntity<>(SUCCESS, HttpStatus.OK);
        } else if(result.equals("403")) {
            return new ResponseEntity<>(FORBIDDEN, HttpStatus.FORBIDDEN);
        } else {
            return new ResponseEntity<>(FAILURE, HttpStatus.BAD_REQUEST);
        }

    }

    // 팀원 목록 조회 GET
    // member/{teamSeq}
    @GetMapping("/member/{teamSeq}")
    public ResponseEntity<List<UserInfoDto>> memberListGet(@RequestHeader("jwt") String jwt, @PathVariable Long teamSeq){

        // 자기 팀이면 ㄱㅊ

        // 내가 속한 것만 골라서 반환
        List<UserInfoDto> userInfoDtoList = teamService.memberList(jwt, teamSeq);

        if(userInfoDtoList==null) {
            return new ResponseEntity<>(null, HttpStatus.BAD_REQUEST);
        } else {
            // 리스트가 비어있어도 잘못된 게 아니기 때문에 그건 거르지 않는다
            return new ResponseEntity<>(userInfoDtoList, HttpStatus.OK);
        }

    }

    // 팀원 추가 PUT
    // add
    @PutMapping("/add")
    public ResponseEntity<String> memberAddPut(@RequestHeader("jwt") String jwt, @RequestBody Map<String, Long> req){

        // 리더 권한 없으면 터질 예정임
        // 이미 팀 내 유저면 터질 예정임

        if(req.get("teamSeq")==null || req.get("memberSeq")==null){
            return new ResponseEntity<>(FAILURE, HttpStatus.BAD_REQUEST);
        }

        String result = teamService.memberAdd(jwt, req.get("teamSeq"), req.get("memberSeq"));

        if(result.equals("success")) {
            return new ResponseEntity<>(SUCCESS, HttpStatus.OK);
        } else if(result.equals("403")) {
            return new ResponseEntity<>(FORBIDDEN, HttpStatus.FORBIDDEN);
        } else {
            return new ResponseEntity<>(FAILURE, HttpStatus.BAD_REQUEST);
        }
    }

    // 팀원 삭제 DELETE
    // remove
    @DeleteMapping("/remove")
    public ResponseEntity<String> memberRemoveDelete(@RequestHeader("jwt") String jwt, @RequestBody Map<String, Long> req){

        // 리더 권한 없으면 터질 예정임 403
        // 팀 내 유저가 아니면 터질 예정임 error
        // 스스로는 내보낼 수 없음 error

        if(req.get("teamSeq")==null || req.get("memberSeq")==null){
            return new ResponseEntity<>(FAILURE, HttpStatus.BAD_REQUEST);
        }

        String result = teamService.memberRemove(jwt, req.get("teamSeq"), req.get("memberSeq"));

        if(result.equals("success")) {
            return new ResponseEntity<>(SUCCESS, HttpStatus.OK);
        } else if(result.equals("403")) {
            return new ResponseEntity<>(FORBIDDEN, HttpStatus.FORBIDDEN);
        } else {
            return new ResponseEntity<>(FAILURE, HttpStatus.BAD_REQUEST);
        }

    }

    // 팀장 위임 PUT
    // beLeader
    @PutMapping("/beLeader")
    public ResponseEntity<String> memberBeLeaderPut(@RequestHeader("jwt") String jwt, @RequestBody Map<String, Long> req){

        // 리더 권한 없으면 터질 예정임 403
        // 팀 내 유저가 아니면 터질 예정임 error

        if(req.get("teamSeq")==null || req.get("memberSeq")==null){
            return new ResponseEntity<>(FAILURE, HttpStatus.BAD_REQUEST);
        }

        String result = teamService.memberBeLeader(jwt, req.get("teamSeq"), req.get("memberSeq"));

        if(result.equals("success")) {
            return new ResponseEntity<>(SUCCESS, HttpStatus.OK);
        } else if(result.equals("403")) {
            return new ResponseEntity<>(FORBIDDEN, HttpStatus.FORBIDDEN);
        } else {
            return new ResponseEntity<>(FAILURE, HttpStatus.BAD_REQUEST);
        }

    }

    // 팀 탈퇴 DELETE
    // quit/{teamSeq}
    @DeleteMapping("/quit/{teamSeq}")
    public ResponseEntity<String> memberQuitDelete(@RequestHeader("jwt") String jwt, @PathVariable Long teamSeq){

        // 리더면 못 나갈 예정임
        // 원래 내 팀이 아니었어도 못 나갈 예정임

        if(jwt==null){
            return new ResponseEntity<>(FAILURE, HttpStatus.UNAUTHORIZED);
        }

        return new ResponseEntity<>(SUCCESS, HttpStatus.OK);

    }

}
