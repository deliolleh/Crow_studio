package com.example.goldencrow.user;

import com.example.goldencrow.user.dto.UserInfoDto;
import org.json.JSONException;
import org.json.JSONObject;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import springfox.documentation.spring.web.json.Json;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping(value="/api/users")
public class UserController {

    private final String SUCCESS = "SUCCESS";
    private final String FAILURE = "FAILURE";
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
    public ResponseEntity<UserInfoDto> infoGet(@RequestHeader("jwt") String jwt) {

        // 일단 성공하면 이렇게 반환될 겁니다
        UserInfoDto userInfoDto = userService.infoService(jwt);
        UserInfoDto.Result result = userInfoDto.getResult();

        if(result==UserInfoDto.Result.EXPIRE) {
            // 액세스 토큰 재발급 요청하세요...
            return new ResponseEntity<>(userInfoDto, HttpStatus.OK);
        } else if(result== UserInfoDto.Result.SUCCESS) {
            return new ResponseEntity<>(userInfoDto, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(null, HttpStatus.BAD_REQUEST);
        }

    }

    // 닉네임 수정
    @PutMapping("/edit/nickname")
    public ResponseEntity<String> editNicknamePut(@RequestHeader("jwt") String jwt, @RequestBody Map<String, String> req) {

        if(jwt==null){
            return new ResponseEntity<>(FAILURE, HttpStatus.UNAUTHORIZED);
        }

        if(req.get("userNickname")==null){
            return new ResponseEntity<>(FAILURE, HttpStatus.BAD_REQUEST);
        }

        // 일단 성공하면 이렇게 반환될 겁니다
        if(userService.editNicknameService(jwt, req).equals("success")) {
            return new ResponseEntity<>(SUCCESS, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(FAILURE, HttpStatus.BAD_REQUEST);
        }

    }

    // 프로필사진 수정
    @PutMapping("/edit/profile")
    public ResponseEntity<String> editProfilePut(@RequestHeader("jwt") String jwt, @RequestBody Map<String, String> req) {

        if(jwt==null){
            return new ResponseEntity<>(FAILURE, HttpStatus.UNAUTHORIZED);
        }

        if(req.get("userProfile")==null){
            return new ResponseEntity<>(FAILURE, HttpStatus.BAD_REQUEST);
        }

        // 일단 성공하면 이렇게 반환될 겁니다
        if(userService.editProfileService(jwt, req).equals("success")) {
            return new ResponseEntity<>(SUCCESS, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(FAILURE, HttpStatus.BAD_REQUEST);
        }

    }

    // 비밀번호 수정
    @PutMapping("/edit/password")
    public ResponseEntity<String> editPasswordPut(@RequestHeader("jwt") String jwt, @RequestBody Map<String, String> req) {

        if(jwt==null){
            return new ResponseEntity<>(FAILURE, HttpStatus.UNAUTHORIZED);
        }

        if(req.get("userPassword")==null || req.get("userNewPassword")==null){
            return new ResponseEntity<>(FAILURE, HttpStatus.BAD_REQUEST);
        }

        // 일단 성공하면 이렇게 반환될 겁니다
        if(userService.editPasswordService(jwt, req).equals("success")) {
            return new ResponseEntity<>(SUCCESS, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(FAILURE, HttpStatus.BAD_REQUEST);
        }

    }

    // 회원탈퇴
    @DeleteMapping("/quit")
    public ResponseEntity<String> quitDelete(@RequestHeader("jwt") String jwt){

        if(jwt==null){
            return new ResponseEntity<>(FAILURE, HttpStatus.UNAUTHORIZED);
        }

        return new ResponseEntity<>(SUCCESS, HttpStatus.OK);

    }

    // 개인 환경 세팅 저장
    @PostMapping("/personal")
    public ResponseEntity<String> personalPost(@RequestHeader("jwt") String jwt, @RequestBody Map<String, Json> req){

        if(jwt==null){
            return new ResponseEntity<>(FAILURE, HttpStatus.UNAUTHORIZED);
        }

        if(req.get("userSettings")==null){
            return new ResponseEntity<>(FAILURE, HttpStatus.BAD_REQUEST);
        }

        System.out.println(req.toString());
        return new ResponseEntity<>(SUCCESS, HttpStatus.OK);

    }

    // 개인 환경 세팅 조회
    @GetMapping("/personal")
    public ResponseEntity<JSONObject> personalGet(@RequestHeader("jwt") String jwt){

        if(jwt==null){
            return new ResponseEntity<>(null, HttpStatus.UNAUTHORIZED);
        }

        try {
            JSONObject jsonObject = new JSONObject(
                    "{ " +
                            "\"name\":\"John\"," +
                            "\"age\":31," +
                            "\"city\":\"New York\"" +
                        "}"
            );
            return new ResponseEntity<>(jsonObject, HttpStatus.OK);
        } catch (JSONException e) {
            e.printStackTrace();
            return new ResponseEntity<>(null, HttpStatus.BAD_REQUEST);
        }

    }

    // (남의) 마이페이지 조회
    @GetMapping("/mypage/{userSeq}")
    public ResponseEntity<UserInfoDto> mypageGet(@PathVariable Long userSeq){

        // 일단 성공하면 이렇게 반환될 겁니다
        UserInfoDto userInfoDto = new UserInfoDto();
        userInfoDto.setUserSeq(new Long(1));
        userInfoDto.setUserId("userIdSample");
        userInfoDto.setUserNickname("userNicknameSample");
        userInfoDto.setUserProfile("user/profile/Sample/jpg");

        return new ResponseEntity<>(userInfoDto, HttpStatus.OK);

    }

    // 리프레시 토큰으로 액세스토큰 요청


}
