package com.example.goldencrow.user;

import com.example.goldencrow.common.CryptoUtil;
import com.example.goldencrow.user.dto.UserInfoDto;
import com.example.goldencrow.user.entity.UserEntity;
import com.example.goldencrow.user.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.persistence.EntityManager;
import java.util.HashMap;
import java.util.Map;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtService jwtService;

    @Autowired
    private EntityManager em;

    // 회원가입
    public Map<String, String> signupService(String userId, String userPassword, String userNickname){

        Map<String, String> res = new HashMap<>();

        // 존재하는 아이디인지 체크
        if(userRepository.findUserEntityByUserId(userId).isPresent()) {
            // 존재할 경우, result에서 결과를 전달함
            res.put("result", "duplicate error");
            System.out.println("duplicate error");
        } else {
            // 존재하지 않을 경우, 회원가입 진행

            // 아이디와 닉네임만 받아서 엔티티 생성
            // 비밀번호 인코딩해서 엔티티에 기록
            // 리프레시토큰 발급해와서 엔티티에 기록
            UserEntity userEntity = new UserEntity(userId, userNickname);
            userEntity.setUserPassWord(CryptoUtil.Sha256.hash(userPassword));
            userEntity.setUserRefresh("");

            // 일단 이 상태로 등록한 다음
            userRepository.saveAndFlush(userEntity);
            System.out.println("일단 저장");

            // userSeq를 다시 읽어와서
            // 액세스 토큰과 리프레시 토큰을 만듦
            Long userSeq = userRepository.findUserEntityByUserId(userId).get().getUserSeq();
            userEntity.setUserSeq(userSeq);
            userEntity.setUserRefresh(jwtService.createRefresh(userSeq));

            // 리프레시 토큰 저장된 상태로 업데이트
            userRepository.save(userEntity);
            System.out.println("업데이트");

            // 액세스 토큰 발급
            String jwt = jwtService.createAccess(userSeq);
            res.put("result", "success");
            res.put("jwt", jwt);

        }

        return res;
    }

    // 로그인
    public Map<String, String> loginService(String userId, String userPassword) {

        Map<String, String> res = new HashMap<>();

        // 존재하는 아이디인지 체크
        if(userRepository.findUserEntityByUserId(userId).isPresent()) {

            // 존재할 경우 일치하는지 검증
            UserEntity userEntity = userRepository.findUserEntityByUserId(userId).get();
            String checkPassword = CryptoUtil.Sha256.hash(userPassword);

            if(userEntity.getUserPassWord().equals(checkPassword)){
                // 만약 비번이 같으면
                // 액세스 토큰 발급
                String jwt = jwtService.createAccess(userEntity.getUserSeq());
                res.put("result", "success");
                res.put("jwt", jwt);
            } else {
                // 비번이 틀렸으면
                res.put("result", "wrong password");
            }

        } else {
            res.put("result", "have to sign up");
        }

        return res;
    }

    // 회원정보조회
    public UserInfoDto infoService(String jwt){

        UserInfoDto userInfoDto = new UserInfoDto();

        try {
            Map<String, Object> verifying = jwtService.verifyJWT(jwt);
            String verifyingResult = (String) verifying.get("result");
            System.out.println(verifyingResult);

            if(verifyingResult.equals("expire")){
                userInfoDto.setResult(UserInfoDto.Result.EXPIRE);

            } else if(verifyingResult.equals("success")){
                UserEntity userEntity = userRepository.findById(new Long(Integer.parseInt(verifying.get("jti").toString()))).get();
                userInfoDto = new UserInfoDto(userEntity);
                userInfoDto.setResult(UserInfoDto.Result.SUCCESS);

            } else {
                userInfoDto.setResult(UserInfoDto.Result.FAILURE);
            }

        } catch (Exception e) {
            userInfoDto.setResult(UserInfoDto.Result.FAILURE);
            throw new RuntimeException(e);
        }

        return userInfoDto;

    }

//    // 닉네임수정
//    public String editNicknameService(String jwt, Map<String, String> req){
//
//
//
//
//
//
//    }

    // 프로필사진 수정

    // 비밀번호 수정

    // 회원탈퇴

    // 개인 환경세팅 저장

    // 개인 환경세팅 조회

    // 마이페이지 조회

}
