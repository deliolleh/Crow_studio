package com.example.goldencrow.user;

import com.example.goldencrow.common.CryptoUtil;
import com.example.goldencrow.file.Service.ProjectService;
import com.example.goldencrow.team.entity.TeamEntity;
import com.example.goldencrow.team.repository.MemberRepository;
import com.example.goldencrow.team.repository.TeamRepository;
import com.example.goldencrow.user.dto.MyInfoDto;
import com.example.goldencrow.user.dto.SettingsDto;
import com.example.goldencrow.user.dto.UserInfoDto;
import com.example.goldencrow.user.entity.UserEntity;
import com.example.goldencrow.user.repository.UserRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.FileOutputStream;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.*;

@Service
public class UserService {

    final String BASE_PATH = "/home/ubuntu/crow_data/userprofile/";

    private final Base64.Encoder encoder = Base64.getEncoder();
    private final Base64.Decoder decoder = Base64.getDecoder();

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private TeamRepository teamRepository;

    @Autowired
    private MemberRepository memberRepository;

    @Autowired
    private JwtService jwtService;

    @Autowired
    private ProjectService projectService;

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
    public MyInfoDto infoService(String jwt){

        MyInfoDto myInfoDto = new MyInfoDto();

        try {
            UserEntity userEntity = userRepository.findById(jwtService.JWTtoUserSeq(jwt)).get();
            myInfoDto = new MyInfoDto(userEntity);

            if(userEntity.getUserGitToken()==null) {
                myInfoDto.setUserGitToken("");
            } else {
                myInfoDto.setUserGitToken(userEntity.getUserGitToken());
            }

            myInfoDto.setResult(UserInfoDto.Result.SUCCESS);

        } catch (Exception e) {
            myInfoDto.setResult(UserInfoDto.Result.FAILURE);
            throw new RuntimeException(e);
        }

        return myInfoDto;

    }

    // 닉네임수정
    public String editNicknameService(String jwt, String userNickname){

        // jwt 체크는 인터셉터에서 해서 넘어왔을테니까

        try {
            // jwt에서 userSeq를 뽑아내고
            Long userSeq = jwtService.JWTtoUserSeq(jwt);
            System.out.println(userSeq);

            // userSeq로 userEntity를 뽑아낸 다음
            UserEntity userEntity = userRepository.findById(userSeq).get();

            // userEntity의 닉네임 부분을 req에서 꺼내온 값으로 수정
            userEntity.setUserNickname(userNickname);

            // saveAndFlush
            userRepository.saveAndFlush(userEntity);

            // 성공 여부 반환
            return "success";

        } catch (Exception e) {
            e.printStackTrace();
            return "error";
        }


    }

    // 프로필사진 수정
    public String editProfileService(String jwt, MultipartFile multipartFile){

        // jwt 체크는 인터셉터에서 해서 넘어왔을테니까

        try {
            // jwt에서 userSeq를 뽑아내고
            Long userSeq = jwtService.JWTtoUserSeq(jwt);

            // 기존에 있던 프로필 사진 정보 조회
            UserEntity userEntity = userRepository.findById(userSeq).get();
            String pastProfile = userEntity.getUserProfile();

            if(pastProfile!=null){
                // null 이 아니라는 것은 기존에 업로드한 이미지가 있다는 뜻
                // 그 주소로 가서 파일 삭제
                Files.delete(Paths.get(pastProfile));
                System.out.println("기존 정보 삭제 완료");
            }

            // 이제 지난 흔적이 없음

            // 유저시퀀스 + 지금 시간 + 입력받은 파일명으로 서버에 저장
            long now = new Date().getTime();
            System.out.println(now);
            String fileName = userSeq + "_" + now + ".jpg";
            String filePath = BASE_PATH + fileName;

            // 밖으로 내보낼 아웃풋스트림 만들고
            FileOutputStream fileOutputStream = new FileOutputStream(filePath);
            // 입력받은 파일을 하나씩 읽을 인풋스트림
            InputStream inputStream = multipartFile.getInputStream();

            try {

                // 읽어들인 글자의 수
                int readCount = 0;

                // 한번에 읽을 만큼의 바이트를 지정
                // 1024, 2048 등의 크기가 일반적
                byte[] buffer = new byte[1024];

                // 끝까지 읽기
                while((readCount = inputStream.read(buffer))!=-1) {
                    fileOutputStream.write(buffer, 0, readCount);
                }

                System.out.println("서버에 저장 완료");
            } catch (Exception e) {
                e.printStackTrace();
            } finally {
                inputStream.close();
                fileOutputStream.close();
            }

            // 방금 넣은 파일의 주소를 db에 저장
            userEntity.setUserProfile(filePath);
            userRepository.saveAndFlush(userEntity);
            System.out.println("db에 저장 완료");

            // 성공 여부 반환
            return filePath;

        } catch (Exception e) {
            e.printStackTrace();
            return "error";
        }

    }

    // 프로필사진 삭제
    public String deleteProfileService(String jwt) {
        try {
            // jwt에서 userSeq를 뽑아내고
            Long userSeq = jwtService.JWTtoUserSeq(jwt);

            // 기존에 있던 프로필 사진 정보 조회
            UserEntity userEntity = userRepository.findById(userSeq).get();
            String pastProfile = userEntity.getUserProfile();

            if(pastProfile!=null){
                // null 이 아니라는 것은 기존에 업로드한 이미지가 있다는 뜻
                // 그 주소로 가서 파일 삭제
                Files.delete(Paths.get(pastProfile));
                System.out.println("기존 정보 삭제 완료");
            }

            userEntity.setUserProfile(null);
            userRepository.saveAndFlush(userEntity);

            // 성공 여부 반환
            return "success";

        } catch (Exception e){
            e.printStackTrace();
            return "error";
        }
    }

    // 비밀번호 수정
    public String editPasswordService(String jwt, Map<String, String> req){

        // jwt 체크는 인터셉터에서 해서 넘어왔을테니까

        try {
            // jwt에서 userSeq를 뽑아내고
            Long userSeq = jwtService.JWTtoUserSeq(jwt);

            // userSeq로 userEntity를 뽑아낸 다음
            UserEntity userEntity = userRepository.findById(userSeq).get();

            // 유저패스워드가 같은지 확인
            String originPW = userEntity.getUserPassWord();
            String testPW = CryptoUtil.Sha256.hash(req.get("userPassword"));

            if(originPW.equals(testPW)) {
                // userEntity의 비밀번호 부분을 req에서 꺼내온 값으로 수정
                userEntity.setUserPassWord(CryptoUtil.Sha256.hash(req.get("userNewPassword")));
                userRepository.saveAndFlush(userEntity);
                return "success";

            } else {
                return "409";
            }

        } catch (Exception e) {
            e.printStackTrace();
            return "error";
        }

    }

    // 깃 아이디, 패스워드 등록
    public String editGitService(String jwt, Map<String, String> req) {

        // jwt 체크는 인터셉터에서 해서 넘어왔을테니까

        try {
            // jwt에서 userSeq를 뽑아내고
            Long userSeq = jwtService.JWTtoUserSeq(jwt);

            // userSeq로 userEntity를 뽑아낸 다음
            UserEntity userEntity = userRepository.findById(userSeq).get();

            String userGitUsername = req.get("userGitUsername");
            String userGitToken = req.get("userGitToken");

            userEntity.setUserGitUsername(userGitUsername);
            userEntity.setUserGitToken(userGitToken);

            userRepository.saveAndFlush(userEntity);

            return "success";

        } catch (Exception e) {
            e.printStackTrace();
            return "error";
        }

    }

    // 회원탈퇴
    public String quitUser(String jwt) {

        try {
            // 사용자 정보 불러와서 체크하고
            // jwt에서 userSeq를 뽑아내고
            Long userSeq = jwtService.JWTtoUserSeq(jwt);

            // 걔가 팀장인 팀이 있나 확인
            List<TeamEntity> teamEntityList = teamRepository.findAllByTeamLeader_UserSeq(userSeq);
            List<Long> teamSeqList = new ArrayList<>();

            for(TeamEntity t : teamEntityList){
                // 그 팀들마다 팀원 수를 세아림

                int count = memberRepository.countAllByTeam(t);

                if(count>=2) {
                    // 1인팀이 아닌 팀이 하나라도 있을 경우
                    // 탐색을 중지하고 탈퇴 불가 처리
                    return "403";
                } else {
                    teamSeqList.add(t.getTeamSeq());
                }

            }

            // 여기까지 왔다면 다인팀이면서 리더인 일은 없을 것

            // 그렇다면 내가 리더인 팀은 전부 단일팀이라는 의미
            // 탈퇴 시에 서버에서 삭제해주어야 함

            if(projectService.deleteProject(teamSeqList).equals("fail!")){
                return "error";
            }

            // userSeq로 userEntity를 뽑아낸 다음
            UserEntity userEntity = userRepository.findById(userSeq).get();

            // 유저 테이블에서 해당 유저 삭제
            userRepository.delete(userEntity);

            // 유저가 날아가기 때문에 멤버도 db에서 알아서 날아갈 것
            // 나혼자 팀장이자 팀원일 경우에는 팀도 db에서 날아감 (서버에선 아까 지움)
            // 다인팀의 경우 팀장이지 않을 것이므로 팀과 파일이 보존됨

            return "success";

        } catch (Exception e) {
            e.printStackTrace();
            return "error";

        }

    }

    // 개인 환경세팅 저장
    public String personalPost(String jwt, SettingsDto data) {

        try {
            // 사용자 정보 불러와서 체크하고
            // jwt에서 userSeq를 뽑아내고
            Long userSeq = jwtService.JWTtoUserSeq(jwt);

            // userSeq로 userEntity를 뽑아낸 다음
            UserEntity userEntity = userRepository.findById(userSeq).get();

            // 받아온 json을 String으로 바꾸기
            JSONObject jsonObject = new JSONObject(data);
            String settings = jsonObject.toString();
            userEntity.setUserSettings(settings);

            // 해당 부분 등록 (수정)
            userRepository.saveAndFlush(userEntity);

            return "success";
        } catch (Exception e) {
            e.printStackTrace();
            return "error";
        }

    }

    // 개인 환경세팅 조회
    public SettingsDto personalGet(String jwt) {

        ObjectMapper mapper = new ObjectMapper();
        SettingsDto settingsDto = new SettingsDto();

        try {
            // 사용자 정보 불러와서 체크하고
            // jwt에서 userSeq를 뽑아내고
            Long userSeq = jwtService.JWTtoUserSeq(jwt);

            // userSeq로 userEntity를 뽑아낸 다음
            UserEntity userEntity = userRepository.findById(userSeq).get();
            String data = userEntity.getUserSettings();

            settingsDto = mapper.readValue(data, SettingsDto.class);
            settingsDto.setResult("success");

        } catch (Exception e) {
            e.printStackTrace();
            settingsDto.setResult("error");
        }

        return settingsDto;

    }

    // 마이페이지 조회
    public UserInfoDto mypage(Long userSeq) {

        UserInfoDto userInfoDto = new UserInfoDto();

        try {
            UserEntity userEntity = userRepository.findById(userSeq).get();
            userInfoDto = new UserInfoDto(userEntity);
            userInfoDto.setResult(UserInfoDto.Result.SUCCESS);

        } catch (Exception e) {
            userInfoDto.setResult(UserInfoDto.Result.FAILURE);
            throw new RuntimeException(e);
        }

        return userInfoDto;

    }

    // 사용자 검색
    public List<UserInfoDto> searchUser(String word) {

        List<UserEntity> userEntityList = userRepository.findAllByUserIdContainingOrUserNicknameContaining(word, word);
        List<UserInfoDto> userInfoDtoList = new ArrayList<>();

        for(UserEntity u : userEntityList) {
            userInfoDtoList.add(new UserInfoDto(u));
        }

        return userInfoDtoList;

    }
}
