package com.example.goldencrow.team;

import com.example.goldencrow.file.service.ProjectService;
import com.example.goldencrow.git.GitService;
import com.example.goldencrow.team.dto.MemberDto;
import com.example.goldencrow.team.dto.TeamDto;
import com.example.goldencrow.team.dto.UserInfoListDto;
import com.example.goldencrow.team.entity.MemberEntity;
import com.example.goldencrow.team.entity.TeamEntity;
import com.example.goldencrow.team.repository.MemberRepository;
import com.example.goldencrow.team.repository.TeamRepository;
import com.example.goldencrow.user.service.JwtService;
import com.example.goldencrow.user.dto.UserInfoDto;
import com.example.goldencrow.user.UserEntity;
import com.example.goldencrow.user.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class TeamService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtService jwtService;

    @Autowired
    private TeamRepository teamRepository;

    @Autowired
    private MemberRepository memberRepository;

    @Autowired
    private ProjectService projectService;

    @Autowired
    private GitService gitService;

    // 팀 목록 조회
    public List<TeamDto> teamList(String jwt) {

        try {

            List<TeamDto> listTeamDto = new ArrayList<>();

            // jwt에서 userSeq를 뽑아내고
            Long userSeq = jwtService.JWTtoUserSeq(jwt);

            // 그 userSeq를 가지는 멤버 엔티티를 뽑아옴
            List<MemberEntity> memberEntities = memberRepository.findAllByUser_UserSeq(userSeq);

            if (!memberEntities.isEmpty()) {
                // 그 모든 엔티티에서 forEach를 돌리면서

                for (MemberEntity m : memberEntities) {

                    // 내가 속한 하나의 팀까지 접근함
                    TeamEntity teamEntity = m.getTeam();

                    // 그 팀의 리더가 누군지 체크
                    Long leaderSeq = teamEntity.getTeamLeader().getUserSeq();

                    // 그 팀에 속한 멤버 리스트를 만들어서
                    List<MemberDto> memberDtoList = new ArrayList<>();

                    // 그 멤버들의 dto로 채우고
                    List<MemberEntity> memberEntityList = memberRepository.findAllByTeam_TeamSeq(teamEntity.getTeamSeq());
                    for(MemberEntity mm : memberEntityList) {
                        // 리더와 다를 때만 넣어준다
                        if(mm.getUser().getUserSeq()!=leaderSeq){
                            memberDtoList.add(new MemberDto(mm));
                        }
                    }

                    // 팀 dto를 만들어서
                    // 아까 채운 멤버 리스트를 팀dto에 채워
                    TeamDto teamDto = new TeamDto(teamEntity);
                    teamDto.setMemberDtoList(memberDtoList);

                    // 그리고 그 팀 dto를 리스트에 넣음
                    listTeamDto.add(teamDto);
                }
            }

            return listTeamDto;

        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }

    }

    // 팀 하나 조회
    public TeamDto teamGet(String jwt, Long teamSeq) {

        try {

            // jwt에서 userSeq를 뽑아내고
            Long userSeq = jwtService.JWTtoUserSeq(jwt);

            Optional<TeamEntity> teamEntityOptional = teamRepository.findByTeamSeq(teamSeq);

            if(!teamEntityOptional.isPresent()) {
                TeamDto teamDto = new TeamDto();
                teamDto.setTeamName("400");
                return teamDto;
            }

            // 그 userSeq와 teamSeq를 가지는 멤버를 뽑아옴
            Optional<MemberEntity> memberEntityOptional = memberRepository.findByUser_UserSeqAndTeam_TeamSeq(userSeq, teamSeq);

            if(memberEntityOptional.isPresent()) {
                // 존재할 경우 : 팀 내부를 볼 권한이 있다

                // 그럼...
                TeamEntity teamEntity = teamEntityOptional.get();

                // 그 팀의 리더가 누군지 체크
                Long leaderSeq = teamEntity.getTeamLeader().getUserSeq();

                // 그 팀에 속한 멤버 리스트를 만들어서
                List<MemberDto> memberDtoList = new ArrayList<>();

                // 팀 시퀀스에 해당하는 멤버 리스트를 다 뽑아와서
                List<MemberEntity> memberEntityList = memberRepository.findAllByTeam_TeamSeq(teamSeq);
                for(MemberEntity mm : memberEntityList) {
                    // 리더와 다를 때만 넣어준다
                    if(mm.getUser().getUserSeq()!=leaderSeq){
                        memberDtoList.add(new MemberDto(mm));
                    }
                }

                // 팀 dto를 만들어서
                // 아까 채운 멤버 리스트를 팀dto에 채워
                TeamDto teamDto = new TeamDto(teamEntity);
                teamDto.setMemberDtoList(memberDtoList);
                return teamDto;

            } else {
                // 아닐 경우 : 없다
                TeamDto teamDto = new TeamDto();
                teamDto.setTeamName("403");
                return teamDto;
            }

        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    // 팀 생성
    public Map<String, Long> teamCreate(String jwt, Map<String, String> req) {

        String teamGit = req.get("teamGit");
        String teamName = req.get("teamName");
        String projectType = req.get("projectType");

        Integer type;
        if(projectType.equals("pure Python")) {
            type = 1;
        } else if(projectType.equals("Django")){
            type = 2;
        } else if(projectType.equals("Flask")) {
            type = 3;
        } else if(projectType.equals("FastAPI")) {
            type = 4;
        } else {
            return null;
        }

        Map<String, Long> res = new HashMap<>();

        try {
            // jwt에서 userSeq를 뽑아내고
            Long userSeq = jwtService.JWTtoUserSeq(jwt);
            // userSeq로 userEntity를 뽑아낸 다음
            UserEntity userEntity = userRepository.findById(userSeq).get();

            // 중복되는 것이 있는지 확인
            // 있으면 리턴 듀플리케이트
            if (teamRepository.findTeamEntityByTeamLeaderAndTeamName(userEntity, teamName).isPresent()) {
                res.put("result", new Long(409));
                return res;
            }

            // 이 사람을 팀장으로 하는 팀 생성하고 저장
            TeamEntity teamEntity = new TeamEntity(userEntity, teamName, type);
            teamRepository.saveAndFlush(teamEntity);

            // 멤버 테이블에도 그 사람을 등록
            TeamEntity savedTeamEntity = teamRepository.findTeamEntityByTeamLeaderAndTeamName(userEntity, teamName).get();
            MemberEntity memberEntity = new MemberEntity(userEntity, savedTeamEntity);
            memberRepository.saveAndFlush(memberEntity);

            // 등록한 것에서 시퀀스를 받아옴
            // 아니... 알아서 오토인크리먼트를 해버려서 시퀀스를 바로 갖다 써도 되는구나...
            Long teamSeq = savedTeamEntity.getTeamSeq();

            if(teamGit==null) {
                // git이 비어있는 상태이므로 클론 받아오지 않는다. createProject 한다

                String projectCreateResult = projectService.createProject("/home/ubuntu/crow_data", type, teamName, teamSeq);

                if(projectCreateResult.equals("1")) {
                    // 성공
                    res.put("result", new Long(200));
                    res.put("teamSeq", teamSeq);
                } else {
                    // 모든 경우의 프로젝트 생성 실패

                    System.out.println(projectCreateResult);

                    // 등록되었던 팀과 멤버를 삭제한다
                    teamRepository.delete(teamRepository.findByTeamSeq(teamSeq).get());

                    if(projectCreateResult.equals("프로젝트 생성에 실패했습니다")){
                        // 아무것도 못함
                        return null;
                    } else if(projectCreateResult.equals("이미 폴더가 존재합니다")||
                            projectCreateResult.equals("이미 파일이 존재합니다")) {
                        // 충돌나서 못만들었음
                        res.put("result", new Long(409));
                    } else {
                        // 왜때매 터졌을까...
                        return null;
                    }

                }

            } else {
                // 쓰여진 이 주소에서 git clone 하겠다는 말이므로 받아온다.
                String gitCloneResult = gitService.gitClone(teamGit, teamSeq, teamName);

                if(gitCloneResult.equals("Success")){
                    // 성공
                    res.put("result", new Long(200));
                    res.put("teamSeq", teamSeq);
                } else {
                    // 모든 경우의 깃 클론 실패

                    System.out.println(gitCloneResult);

                    // 등록되었던 팀과 멤버를 삭제한다
                    teamRepository.delete(teamRepository.findByTeamSeq(teamSeq).get());

                    if(gitCloneResult.equals("폴더 생성에 실패했습니다")){
                        // 아무것도 못함
                        return null;
                    } else if(gitCloneResult.equals("해당 폴더가 존재하지 않습니다.")||
                            gitCloneResult.equals("해당 팀이 존재하지 않습니다")){
                        // 못 찾아서 못 만들었음
                        res.put("result", new Long(404));
                    } else {
                        // 뭔가 문제가 있긴 한데...
                        return null;
                    }

                }

            }

        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }

        return res;

    }

    // 팀명 수정
    public String teamModifyName(String jwt, Long teamSeq, String teamName) {

        try {
            // jwt에서 userSeq를 뽑아내고
            Long userSeq = jwtService.JWTtoUserSeq(jwt);

            Optional<TeamEntity> teamEntityFoundCheck = teamRepository.findByTeamSeq(teamSeq);

            if(!teamEntityFoundCheck.isPresent()) {
                // 그런 팀 없다
                return "404";
            }

            Optional<TeamEntity> teamEntityOptional = teamRepository.findByTeamSeqAndTeamLeader_UserSeq(teamSeq, userSeq);

            if (teamEntityOptional.isPresent()) {

                Optional<TeamEntity> teamEntityConflictCheck = teamRepository.findTeamEntityByTeamLeaderAndTeamName(userRepository.findByUserSeq(userSeq), teamName);

                if(teamEntityConflictCheck.isPresent()) {
                    // 중복되는 팀 리더와 팀 명이 있음
                    return "409";
                }

                TeamEntity teamEntity = teamEntityOptional.get();
                teamEntity.setTeamName(teamName);
                teamRepository.saveAndFlush(teamEntity);
                return "success";
            } else {
                return "403";
            }

        } catch (Exception e) {
            e.printStackTrace();
            return "error";
        }

    }

    // 팀 깃 수정
    public String teamModifyGit(String jwt, Long teamSeq, String teamGit) {

        try {
            // jwt에서 userSeq를 뽑아내고
            Long userSeq = jwtService.JWTtoUserSeq(jwt);

            Optional<TeamEntity> teamEntityFoundCheck = teamRepository.findByTeamSeq(teamSeq);

            if(!teamEntityFoundCheck.isPresent()) {
                // 그런 팀 없다
                return "404";
            }

            Optional<TeamEntity> teamEntityOptional = teamRepository.findByTeamSeqAndTeamLeader_UserSeq(teamSeq, userSeq);

            if (teamEntityOptional.isPresent()) {
                // 내가 리더면
                TeamEntity teamEntity = teamEntityOptional.get();
                teamEntity.setTeamGit(teamGit);
                teamRepository.saveAndFlush(teamEntity);
                return "success";
            } else {
                return "403";
            }

        } catch (Exception e) {
            e.printStackTrace();
            return "error";
        }

    }

    // 팀 프로젝트 타입 수정
    public String teamModifyType(String jwt, Long teamSeq, String projectType) {

        try {
            // jwt에서 userSeq를 뽑아내고
            Long userSeq = jwtService.JWTtoUserSeq(jwt);

            Optional<TeamEntity> teamEntityFoundCheck = teamRepository.findByTeamSeq(teamSeq);

            if(!teamEntityFoundCheck.isPresent()) {
                // 그런 팀 없다
                return "404";
            }

            Optional<TeamEntity> teamEntityOptional = teamRepository.findByTeamSeqAndTeamLeader_UserSeq(teamSeq, userSeq);

            if (teamEntityOptional.isPresent()) {
                // 내가 리더면
                TeamEntity teamEntity = teamEntityOptional.get();

                if(projectType.equals("pure Python")) {
                    teamEntity.setType(1);
                } else if(projectType.equals("Django")){
                    teamEntity.setType(2);
                } else if(projectType.equals("Flask")) {
                    teamEntity.setType(3);
                } else if(projectType.equals("FastAPI")) {
                    teamEntity.setType(4);
                } else {
                    return null;
                }

                teamRepository.saveAndFlush(teamEntity);
                return "success";
            } else {
                return "403";
            }

        } catch (Exception e) {
            e.printStackTrace();
            return "error";
        }

    }


    // 팀 삭제
    public String teamDelete(String jwt, Long teamSeq) {

        try {
            // jwt에서 userSeq를 뽑아내고
            Long userSeq = jwtService.JWTtoUserSeq(jwt);

            Optional<TeamEntity> teamEntityFoundCheck = teamRepository.findByTeamSeq(teamSeq);

            if(!teamEntityFoundCheck.isPresent()) {
                return "404";
            }

            Optional<TeamEntity> teamEntityOptional = teamRepository.findByTeamSeqAndTeamLeader_UserSeq(teamSeq, userSeq);

            if (teamEntityOptional.isPresent()) {
                TeamEntity teamEntity = teamEntityOptional.get();
                teamRepository.delete(teamEntity);

                // 팀이 날아가기 때문에 멤버db도 날아가고 파일db도 날아간다 (캐스케이드)

                // 하지만 파일을 직접 날리긴 해야해!!
                List<Long> teamSeqList = new ArrayList<>();
                teamSeqList.add(teamSeq);
                if(projectService.deleteProject(teamSeqList).equals("fail!")) {
                    return "501";
                }

                return "success";
            } else {
                return "403";
            }

        } catch (Exception e) {
            e.printStackTrace();
            return "error";
        }

    }

    // 팀원 목록 조회
    public UserInfoListDto memberList(String jwt, Long teamSeq) {

        try {

            Optional<TeamEntity> teamEntityFoundCheck = teamRepository.findByTeamSeq(teamSeq);

            if(!teamEntityFoundCheck.isPresent()) {
                UserInfoListDto userInfoListDto = new UserInfoListDto();
                userInfoListDto.setResult("404");
                return userInfoListDto;
            }

            List<UserInfoDto> userInfoDtoList = new ArrayList<>();

            // jwt에서 userSeq를 뽑아내고
            Long userSeq = jwtService.JWTtoUserSeq(jwt);

            // 내가 멤버로 속해있는지를 확인해야함
            Optional<MemberEntity> memberEntityOptional = memberRepository.findByUser_UserSeqAndTeam_TeamSeq(userSeq, teamSeq);

            if (memberEntityOptional.isPresent()) {
                // 내가 그 팀의 멤버로 있음이 확인되었으므로
                // 그 팀의 멤버 목록을 리스트로 받아옴
                List<MemberEntity> memberEntityList = memberRepository.findAllByTeam_TeamSeq(teamSeq);

                for (MemberEntity m : memberEntityList) {
                    userInfoDtoList.add(new UserInfoDto(m.getUser()));
                }

                UserInfoListDto userInfoListDto = new UserInfoListDto(userInfoDtoList);

                return userInfoListDto;

            } else {
                UserInfoListDto userInfoListDto = new UserInfoListDto();
                userInfoListDto.setResult("403");
                return userInfoListDto;
            }

        } catch (Exception e) {
            e.printStackTrace();
            UserInfoListDto userInfoListDto = new UserInfoListDto();
            userInfoListDto.setResult("error");
            return userInfoListDto;
        }

    }

    // 팀원 추가
    public String memberAdd(String jwt, Long teamSeq, Long memberSeq) {

        try {

            // jwt에서 userSeq를 뽑아내고
            Long userSeq = jwtService.JWTtoUserSeq(jwt);

            // 그런 팀이 존재하는지 체크
            Optional<TeamEntity> teamEntity = teamRepository.findById(teamSeq);

            // 팀이 존재하는지 체크
            if (teamEntity.isPresent()) {
                // 내가 장이 맞는지 체크
                if (teamEntity.get().getTeamLeader().getUserSeq() == userSeq) {
                    // 이 멤버가 여기 원래 없는게 맞는지 체크
                    if (!memberRepository.findByUser_UserSeqAndTeam_TeamSeq(memberSeq, teamSeq).isPresent()) {
                        // 모든 조건 만족
                        MemberEntity memberEntity = new MemberEntity(userRepository.findById(memberSeq).get(), teamEntity.get());
                        memberRepository.saveAndFlush(memberEntity);
                        return "success";

                    } else {
                        return "409";
                    }
                } else {
                    return "403";
                }
            } else {
                return "404";
            }

        } catch (Exception e) {
            e.printStackTrace();
            return "error";
        }

    }

    // 팀원 제거
    public String memberRemove(String jwt, Long teamSeq, Long memberSeq) {

        try {

            // jwt에서 userSeq를 뽑아내고
            Long userSeq = jwtService.JWTtoUserSeq(jwt);

            // 자기 자신이 아닌게 맞는지 체크
            if(userSeq==memberSeq) {
                return "409";
            }

            // 그런 팀이 존재하는지 체크
            Optional<TeamEntity> teamEntity = teamRepository.findById(teamSeq);

            // 팀이 존재하는지 체크
            if (teamEntity.isPresent()) {
                // 내가 장이 맞는지 체크
                if (teamEntity.get().getTeamLeader().getUserSeq() == userSeq) {
                    // 이 멤버가 여기 원래 있는게 맞는지 체크
                    if (memberRepository.findByUser_UserSeqAndTeam_TeamSeq(memberSeq, teamSeq).isPresent()) {
                        // 모든 조건 만족
                        MemberEntity memberEntity = memberRepository.findByUser_UserSeqAndTeam_TeamSeq(memberSeq, teamSeq).get();
                        memberRepository.delete(memberEntity);
                        return "success";

                    } else {
                        return "409";
                    }
                } else {
                    return "403";
                }
            } else {
                return "404";
            }

        } catch (Exception e) {
            e.printStackTrace();
            return "error";
        }

    }

    // 팀장 위임
    public String memberBeLeader(String jwt, Long teamSeq, Long memberSeq){

        try {

            // jwt에서 userSeq를 뽑아내고
            Long userSeq = jwtService.JWTtoUserSeq(jwt);

            // 자기 자신이 아닌게 맞는지 체크
            if(userSeq==memberSeq) {
                return "409";
            }

            // 그런 팀이 존재하는지 체크
            Optional<TeamEntity> teamEntityOptional = teamRepository.findById(teamSeq);

            // 팀이 존재하는지 체크
            if (teamEntityOptional.isPresent()) {
                // 내가 장이 맞는지 체크
                if (teamEntityOptional.get().getTeamLeader().getUserSeq() == userSeq) {
                    // 이 멤버가 여기 원래 있는게 맞는지 체크
                    if (memberRepository.findByUser_UserSeqAndTeam_TeamSeq(memberSeq, teamSeq).isPresent()) {
                        // 모든 조건 만족
                        // 팀 레포지토리의 팀장을 바꾼다
                        TeamEntity teamEntity = teamEntityOptional.get();
                        teamEntity.setTeamLeader(userRepository.findById(memberSeq).get());
                        teamRepository.saveAndFlush(teamEntity);
                        return "success";

                    } else {
                        return "409";
                    }
                } else {
                    return "403";
                }
            } else {
                return "404";
            }

        } catch (Exception e) {
            e.printStackTrace();
            return "error";
        }

    }

    // 팀 탈퇴
    public String memberQuit(String jwt, Long teamSeq) {

        try {

            Optional<TeamEntity> teamEntityFoundCheck = teamRepository.findByTeamSeq(teamSeq);

            if(!teamEntityFoundCheck.isPresent()) {
                return "404";
            }

            // jwt에서 userSeq를 뽑아내고
            Long userSeq = jwtService.JWTtoUserSeq(jwt);

            // 저 팀 시퀀스를 가지고 내가 속한 멤버가 있는지 확인
            Optional<MemberEntity> memberEntityOptional = memberRepository.findByUser_UserSeqAndTeam_TeamSeq(userSeq, teamSeq);

            if(memberEntityOptional.isPresent()){
                // 있다면 그 팀 리더가 내가 아닌 게 맞는지 확인
                Optional<TeamEntity> teamEntityOptional = teamRepository.findByTeamSeqAndTeamLeader_UserSeq(teamSeq, userSeq);
                if(!teamEntityOptional.isPresent()){
                    // 내가 리더가 아니라면
                    // 그 멤버 엔티티만 찾아서 삭제하면 됨
                    MemberEntity memberEntity = memberEntityOptional.get();
                    memberRepository.delete(memberEntity);
                    return "success";
                } else {
                    // 저 팀이 있다는 건 내가 팀 리더란 소리이므로
                    return "403";
                }
            } else {
                return "409";
            }

        } catch (Exception e) {
            e.printStackTrace();
            return "error";
        }

    }


}
