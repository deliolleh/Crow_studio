package com.example.goldencrow.user;

import com.example.goldencrow.user.dto.MyInfoDto;
import com.example.goldencrow.user.dto.SettingsDto;
import com.example.goldencrow.user.dto.UserInfoDto;
import com.example.goldencrow.user.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static com.example.goldencrow.common.Constants.*;

/**
 * 사용자와 관련된 입출력을 처리하는 컨트롤러
 *
 * @url /api/users
 */
@RestController
@RequestMapping(value = "/api/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    /**
     * 회원가입 API
     *
     * @param req "userId", "userPassword", "userNickname"을 key로 가지는 String map
     * @return 회원가입 성공 시 jwt 반환, 성패에 따른 result 반환
     * @status 200, 400, 409
     */
    @PostMapping("/signup")
    public ResponseEntity<Map<String, String>> signupPost(@RequestBody Map<String, String> req) {

        if (req.containsKey("userId") && req.containsKey("userPassword") && req.containsKey("userNickname")) {

            String userId = req.get("userId");
            String userPassword = req.get("userPassword");
            String userNickname = req.get("userNickname");

            Map<String, String> res = userService.signupService(userId, userPassword, userNickname);
            String result = res.get("result");

            if (result.equals(SUCCESS)) {
                return new ResponseEntity<>(res, HttpStatus.OK);
            } else if (result.equals(DUPLICATE)) {
                return new ResponseEntity<>(res, HttpStatus.CONFLICT);
            } else {
                return new ResponseEntity<>(res, HttpStatus.BAD_REQUEST);
            }

        } else {
            Map<String, String> res = new HashMap<>();
            res.put("result", BAD_REQ);
            return new ResponseEntity<>(res, HttpStatus.BAD_REQUEST);
        }

    }

    /**
     * 로그인 API
     *
     * @param req "userId", "userPassword"를 key로 가지는 String map
     * @return 로그인 성공 시 jwt 반환, 성패에 따른 result 반환
     * @status 200, 400, 409
     */
    @PostMapping("/login")
    public ResponseEntity<Map<String, String>> loginPost(@RequestBody Map<String, String> req) {

        if (req.containsKey("userId") && req.containsKey("userPassword")) {

            String userId = req.get("userId");
            String userPassword = req.get("userPassword");

            Map<String, String> res = userService.loginService(userId, userPassword);
            String result = res.get("result");

            if (result.equals(SUCCESS)) {
                return new ResponseEntity<>(res, HttpStatus.OK);
            } else if (result.equals(WRONG) || result.equals(NO_SUCH)) {
                return new ResponseEntity<>(res, HttpStatus.CONFLICT);
            } else {
                return new ResponseEntity<>(res, HttpStatus.BAD_REQUEST);
            }

        } else {
            Map<String, String> res = new HashMap<>();
            res.put("result", BAD_REQ);
            return new ResponseEntity<>(res, HttpStatus.BAD_REQUEST);
        }

    }

    /**
     * 각 회원의 정보를 조회하는 API
     * access token 필요
     *
     * @param jwt 회원가입 및 로그인 시 발급되는 access token
     * @return 당사자가 조회 가능한 사용자 정보 반환, 성패에 따른 result 반환
     * @status 200, 400, 401, 404
     */
    @GetMapping("/info")
    public ResponseEntity<MyInfoDto> myInfoGet(@RequestHeader("Authorization") String jwt) {

        MyInfoDto myInfoDtoRes = userService.myInfoService(jwt);
        String result = myInfoDtoRes.getResult();

        if (result.equals(SUCCESS)) {
            return new ResponseEntity<>(myInfoDtoRes, HttpStatus.OK);
        } else if (result.equals(NO_SUCH)){
            return new ResponseEntity<>(myInfoDtoRes, HttpStatus.NOT_FOUND);
        } else {
            return new ResponseEntity<>(myInfoDtoRes, HttpStatus.BAD_REQUEST);
        }

    }

    /**
     * 사용자 닉네임을 수정하는 API
     * access token 필요
     *
     * @param jwt 회원가입 및 로그인 시 발급되는 access token
     * @param req "userNickname"을 key로 가지는 String map
     * @return 변경된 닉네임 반환, 성패에 따른 result 반환
     * @status 200, 400, 401, 404
     */
    @PutMapping("/edit/nickname")
    public ResponseEntity<Map<String, String>> editNicknamePut(@RequestHeader("Authorization") String jwt,
                                                               @RequestBody Map<String, String> req) {

        if (req.containsKey("userNickname")) {

            String userNickname = req.get("userNickname");

            Map<String, String> res = userService.editNicknameService(jwt, userNickname);
            String result = res.get("result");

            if (result.equals(SUCCESS)) {
                return new ResponseEntity<>(res, HttpStatus.OK);
            } else if (result.equals(NO_SUCH)){
                return new ResponseEntity<>(res, HttpStatus.NOT_FOUND);
            } else {
                return new ResponseEntity<>(res, HttpStatus.BAD_REQUEST);
            }

        } else {
            Map<String, String> res = new HashMap<>();
            res.put("result", BAD_REQ);
            return new ResponseEntity<>(res, HttpStatus.BAD_REQUEST);

        }

    }

    /**
     * 프로필 사진을 수정하는 API
     *
     * @param jwt 회원가입 및 로그인 시 발급되는 access token
     * @param multipartFile 프로필 사진으로 사용할 jpg 이미지 파일
     * @return 성패에 따른 result 반환
     * @deprecated 현재 사용되고 있지 않으나, 이용 가능함
     * @status 200, 400, 401, 404
     */
    @PutMapping("/edit/profile")
    public ResponseEntity<Map<String, String>> editProfilePut(@RequestHeader("Authorization") String jwt,
                                                              @RequestBody MultipartFile multipartFile) {

        if (multipartFile.isEmpty()) {
            return new ResponseEntity<>(null, HttpStatus.BAD_REQUEST);
        }

        Map<String, String> res = userService.editProfileService(jwt, multipartFile);
        String result = res.get("result");

        if (result.equals(SUCCESS)) {
            return new ResponseEntity<>(res, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(res, HttpStatus.BAD_REQUEST);
        }

    }

    /**
     * 프로필 사진을 삭제하는 API
     *
     * @param jwt 회원가입 및 로그인 시 발급되는 access token
     * @return 성패에 따른 result 반환
     * @deprecated 현재 사용되고 있지 않으나, 이용 가능함
     * @status 200, 400, 401, 404
     */
    @DeleteMapping("/edit/profile")
    public ResponseEntity<Map<String, String>> deleteProfileDelete(@RequestHeader("Authorization") String jwt) {

        Map<String, String> res = userService.deleteProfileService(jwt);
        String result = res.get("result");

        if (result.equals(SUCCESS)) {
            return new ResponseEntity<>(res, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(res, HttpStatus.BAD_REQUEST);
        }

    }

    // 비밀번호 수정
    @PutMapping("/edit/password")
    public ResponseEntity<String> editPasswordPut(@RequestHeader("Authorization") String jwt,
                                                  @RequestBody Map<String, String> req) {

        if (req.get("userPassword") == null || req.get("userNewPassword") == null) {
            return new ResponseEntity<>(FAILURE, HttpStatus.BAD_REQUEST);
        }

        String result = userService.editPasswordService(jwt, req);

        // 일단 성공하면 이렇게 반환될 겁니다
        if (result.equals("success")) {
            return new ResponseEntity<>(SUCCESS, HttpStatus.OK);
        } else if (result.equals("409")) {
            return new ResponseEntity<>(CONFLICT, HttpStatus.CONFLICT);
        } else {
            return new ResponseEntity<>(FAILURE, HttpStatus.BAD_REQUEST);
        }

    }

    // 깃 정보 수정
    public ResponseEntity<String> editGitPut(@RequestHeader("Authorization") String jwt,
                                             @RequestBody Map<String, String> req) {

        if (req.get("userGitId") == null || req.get("userGitPassword") == null) {
            return new ResponseEntity<>(FAILURE, HttpStatus.BAD_REQUEST);
        }

        String result = userService.editGitService(jwt, req);

        // 일단 성공하면 이렇게 반환될 겁니다
        if (result.equals("success")) {
            return new ResponseEntity<>(req.get("userGitId"), HttpStatus.OK);
        } else {
            return new ResponseEntity<>(FAILURE, HttpStatus.BAD_REQUEST);
        }

    }

    // 회원탈퇴
    @DeleteMapping("/quit")
    public ResponseEntity<String> quitDelete(@RequestHeader("Authorization") String jwt) {

        String result = userService.quitUser(jwt);

        // 일단 성공하면 이렇게 반환될 겁니다
        if (result.equals("success")) {
            return new ResponseEntity<>(SUCCESS, HttpStatus.OK);
        } else if (result.equals("403")) {
            return new ResponseEntity<>(FORBIDDEN, HttpStatus.FORBIDDEN);
        } else {
            return new ResponseEntity<>(FAILURE, HttpStatus.BAD_REQUEST);
        }

    }

    // 개인 환경 세팅 저장
    @PutMapping("/personal")
    public ResponseEntity<String> personalPost(@RequestHeader("Authorization") String jwt,
                                               @RequestBody SettingsDto req) {

        // 일단 성공하면 이렇게 반환될 겁니다
        if (userService.personalPost(jwt, req).equals("success")) {
            return new ResponseEntity<>(SUCCESS, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(FAILURE, HttpStatus.BAD_REQUEST);
        }

    }

    // 개인 환경 세팅 조회
    @GetMapping("/personal")
    public ResponseEntity<SettingsDto> personalGet(@RequestHeader("Authorization") String jwt) {

        SettingsDto settingsDto = userService.personalGet(jwt);

        if (settingsDto.getResult().equals("success")) {
            return new ResponseEntity<>(settingsDto, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(null, HttpStatus.BAD_REQUEST);
        }

    }

    // (남의) 마이페이지 조회
    @GetMapping("/mypage/{userSeq}")
    public ResponseEntity<UserInfoDto> mypageGet(@PathVariable Long userSeq) {

        UserInfoDto userInfoDto = userService.mypage(userSeq);

        if (userInfoDto.getResult() == UserInfoDto.Result.SUCCESS) {
            return new ResponseEntity<>(userInfoDto, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(null, HttpStatus.BAD_REQUEST);
        }

    }

    // 사용자 검색하기
    @PostMapping("/search")
    public ResponseEntity<List<UserInfoDto>> searchUserGet(@RequestBody Map<String, String> req) {

        String word = req.get("searchWord");

        // 내가 속한 것만 골라서 반환
        List<UserInfoDto> userInfoDtoList = userService.searchUser(word);

        if (userInfoDtoList == null) {
            return new ResponseEntity<>(null, HttpStatus.BAD_REQUEST);
        } else {
            // 리스트가 비어있어도 잘못된 게 아니기 때문에 그건 거르지 않는다
            return new ResponseEntity<>(userInfoDtoList, HttpStatus.OK);
        }

    }

}
