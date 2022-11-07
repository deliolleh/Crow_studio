package com.example.goldencrow.user;

import com.example.goldencrow.user.dto.MyInfoDto;
import com.example.goldencrow.user.dto.UserInfoDto;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping(value="/api/users")
public class UserController {

    private final String SUCCESS = "SUCCESS";
    private final String FAILURE = "FAILURE";
    private final String FORBIDDEN = "FORBIDDEN";
    private final String CONFLICT = "CONFLICT";
    private final UserService userService;
    private final JwtService jwtService;

    public UserController(UserService userService, JwtService jwtService) {
        this.userService = userService;
        this.jwtService = jwtService;
    }

    // 회원가입
    @PostMapping("/signup")
    public ResponseEntity<Map<String, String>> signupPost(@RequestBody Map<String, String> req) {

        String userId = req.get("userId");
        String userPassword = req.get("userPassword");
        String userNickname = req.get("userNickname");

        // 셋 중 하나라도 비면 401
        if(userId==null || userPassword==null || userNickname==null){
            return new ResponseEntity<>(null, HttpStatus.BAD_REQUEST);
        }

        // 일단 성공하면 이렇게 반환될 겁니다
        Map<String, String> temp = userService.signupService(userId, userPassword, userNickname);

        if(temp.get("result").equals("success")){
            Map<String, String> res = new HashMap<>();
            res.put("jwt", temp.get("jwt"));
            return new ResponseEntity<>(res, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(null, HttpStatus.CONFLICT);
        }
    }

    // 로그인
    @PostMapping("/login")
    public ResponseEntity<Map<String, String>> loginPost(@RequestBody Map<String, String> req){

        String userId = req.get("userId");
        String userPassword = req.get("userPassword");

        if(userId==null || userPassword==null){
            return new ResponseEntity<>(null, HttpStatus.BAD_REQUEST);
        }

        // 일단 성공하면 이렇게 반환될 겁니다
        Map<String, String> temp = userService.loginService(userId, userPassword);

        if(temp.get("result").equals("success")){
            Map<String, String> res = new HashMap<>();
            res.put("jwt", temp.get("jwt"));
            return new ResponseEntity<>(res, HttpStatus.OK);
        } else {
            // 비번이 틀렸거나 없는 정보입니다
            return new ResponseEntity<>(null, HttpStatus.CONFLICT);
        }

    }

    // 회원정보 조회
    @GetMapping("/info")
    public ResponseEntity<MyInfoDto> infoGet(@RequestHeader("Authorization") String jwt) {

        // 일단 성공하면 이렇게 반환될 겁니다
        MyInfoDto myInfoDto = userService.infoService(jwt);
        UserInfoDto.Result result = myInfoDto.getResult();

        if(result==UserInfoDto.Result.EXPIRE) {
            // 액세스 토큰 재발급 요청하세요...
            return new ResponseEntity<>(myInfoDto, HttpStatus.OK);
        } else if(result== UserInfoDto.Result.SUCCESS) {
            return new ResponseEntity<>(myInfoDto, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(null, HttpStatus.BAD_REQUEST);
        }

    }

    // 닉네임 수정
    @PutMapping("/edit/nickname")
    public ResponseEntity<String> editNicknamePut(@RequestHeader("Authorization") String jwt, @RequestBody Map<String, String> req) {

        if(req.get("userNickname")==null){
            return new ResponseEntity<>(FAILURE, HttpStatus.BAD_REQUEST);
        }

        String userNickname = req.get("userNickname");

        // 일단 성공하면 이렇게 반환될 겁니다
        if(userService.editNicknameService(jwt, userNickname).equals("success")) {
            return new ResponseEntity<>(userNickname, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(FAILURE, HttpStatus.BAD_REQUEST);
        }

    }

    // 프로필사진 수정
    @PutMapping("/edit/profile")
    public ResponseEntity<String> editProfilePut(@RequestHeader("Authorization") String jwt, @RequestBody MultipartFile multipartFile) {

        if (multipartFile.isEmpty()) {
            return new ResponseEntity<>(null, HttpStatus.BAD_REQUEST);
        }

        String result = userService.editProfileService(jwt, multipartFile);

        // 실패시!!! 이렇게 반환될 겁니다
        if(result.equals("error")) {
            return new ResponseEntity<>(FAILURE, HttpStatus.BAD_REQUEST);
        } else {
            return new ResponseEntity<>(result, HttpStatus.OK);
        }

    }

    // 프로필사진 삭제
    @DeleteMapping("/edit/profile")
    public ResponseEntity<String> deleteProfileDelete(@RequestHeader("Authorization") String jwt){

        // 일단 성공하면 이렇게 반환될 겁니다
        if(userService.deleteProfileService(jwt).equals("success")) {
            return new ResponseEntity<>(SUCCESS, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(FAILURE, HttpStatus.BAD_REQUEST);
        }

    }

    // 비밀번호 수정
    @PutMapping("/edit/password")
    public ResponseEntity<String> editPasswordPut(@RequestHeader("Authorization") String jwt, @RequestBody Map<String, String> req) {

        if(req.get("userPassword")==null || req.get("userNewPassword")==null){
            return new ResponseEntity<>(FAILURE, HttpStatus.BAD_REQUEST);
        }

        String result = userService.editPasswordService(jwt, req);

        // 일단 성공하면 이렇게 반환될 겁니다
        if(result.equals("success")) {
            return new ResponseEntity<>(SUCCESS, HttpStatus.OK);
        } else if(result.equals("409")){
            return new ResponseEntity<>(CONFLICT, HttpStatus.CONFLICT);
        } else {
            return new ResponseEntity<>(FAILURE, HttpStatus.BAD_REQUEST);
        }

    }

//    // 깃 정보 수정
//    public ResponseEntity<String> editGitPut(@RequestHeader("Authorization") String jwt, @RequestBody Map<String, String> req){
//
//        if(req.get("userGitId")==null || req.get("userGitPassword")==null){
//            return new ResponseEntity<>(FAILURE, HttpStatus.BAD_REQUEST);
//        }
//
//        String result = userService.editGitService(jwt, req);
//
//        // 일단 성공하면 이렇게 반환될 겁니다
//        if(result.equals("success")) {
//            return new ResponseEntity<>(SUCCESS, HttpStatus.OK);
//        } else {
//            return new ResponseEntity<>(FAILURE, HttpStatus.BAD_REQUEST);
//        }
//
//    }

    // 회원탈퇴
    @DeleteMapping("/quit")
    public ResponseEntity<String> quitDelete(@RequestHeader("Authorization") String jwt){

        String result = userService.quitUser(jwt);

        // 일단 성공하면 이렇게 반환될 겁니다
        if(result.equals("success")) {
            return new ResponseEntity<>(SUCCESS, HttpStatus.OK);
        } else if(result.equals("403")){
            return new ResponseEntity<>(FORBIDDEN, HttpStatus.FORBIDDEN);
        } else {
            return new ResponseEntity<>(FAILURE, HttpStatus.BAD_REQUEST);
        }

    }

    // 개인 환경 세팅 저장
    @PutMapping("/personal")
    public ResponseEntity<String> personalPost(@RequestHeader("Authorization") String jwt, @RequestBody UserInfoDto req){

        // 일단 성공하면 이렇게 반환될 겁니다
        if(userService.personalPost(jwt, req).equals("success")) {
            return new ResponseEntity<>(SUCCESS, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(FAILURE, HttpStatus.BAD_REQUEST);
        }

    }

    // 개인 환경 세팅 조회
    @GetMapping("/personal")
    public ResponseEntity<UserInfoDto> personalGet(@RequestHeader("Authorization") String jwt){

        UserInfoDto userInfoDto = userService.personalGet(jwt);

        if(userInfoDto.getResult()== UserInfoDto.Result.SUCCESS){
            return new ResponseEntity<>(userInfoDto, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(null, HttpStatus.BAD_REQUEST);
        }

    }

    // (남의) 마이페이지 조회
    @GetMapping("/mypage/{userSeq}")
    public ResponseEntity<UserInfoDto> mypageGet(@PathVariable Long userSeq){

        UserInfoDto userInfoDto = userService.mypage(userSeq);

        if(userInfoDto.getResult()== UserInfoDto.Result.SUCCESS){
            return new ResponseEntity<>(userInfoDto, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(null, HttpStatus.BAD_REQUEST);
        }

    }

    // 사용자 검색하기
    @PostMapping("/search")
    public ResponseEntity<List<UserInfoDto>> searchUserGet(@RequestBody Map<String, String> req){

        String word = req.get("searchWord");

        // 내가 속한 것만 골라서 반환
        List<UserInfoDto> userInfoDtoList = userService.searchUser(word);

        if(userInfoDtoList==null) {
            return new ResponseEntity<>(null, HttpStatus.BAD_REQUEST);
        } else {
            // 리스트가 비어있어도 잘못된 게 아니기 때문에 그건 거르지 않는다
            return new ResponseEntity<>(userInfoDtoList, HttpStatus.OK);
        }

    }

    // 리프레시 토큰으로 액세스토큰 요청

}
