package com.example.goldencrow.team;

import com.example.goldencrow.file.Service.ProjectService;
import com.example.goldencrow.team.dto.MemberDto;
import com.example.goldencrow.team.dto.TeamDto;
import com.example.goldencrow.team.entity.MemberEntity;
import com.example.goldencrow.team.entity.TeamEntity;
import com.example.goldencrow.team.repository.MemberRepository;
import com.example.goldencrow.team.repository.TeamRepository;
import com.example.goldencrow.user.JwtService;
import com.example.goldencrow.user.dto.UserInfoDto;
import com.example.goldencrow.user.entity.UserEntity;
import com.example.goldencrow.user.repository.UserRepository;
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
    public Map<String, Long> teamCreate(String jwt, String teamName) {

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
            TeamEntity teamEntity = new TeamEntity(userEntity, teamName);
            teamRepository.saveAndFlush(teamEntity);

            // 멤버 테이블에도 그 사람을 등록
            TeamEntity savedTeamEntity = teamRepository.findTeamEntityByTeamLeaderAndTeamName(userEntity, teamName).get();
            MemberEntity memberEntity = new MemberEntity(userEntity, savedTeamEntity);
            memberRepository.saveAndFlush(memberEntity);

            // 성공 여부 반환
            res.put("result", new Long(200));
            res.put("teamSeq", savedTeamEntity.getTeamSeq());
            return res;

        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }

    }

    // 팀(명) 수정
    public String teamModify(String jwt, Long teamSeq, String teamName) {

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

    // 팀 삭제
    public String teamDelete(String jwt, Long teamSeq) {

        try {
            // jwt에서 userSeq를 뽑아내고
            Long userSeq = jwtService.JWTtoUserSeq(jwt);

            Optional<TeamEntity> teamEntityOptional = teamRepository.findByTeamSeqAndTeamLeader_UserSeq(teamSeq, userSeq);

            if (teamEntityOptional.isPresent()) {
                TeamEntity teamEntity = teamEntityOptional.get();
                teamRepository.delete(teamEntity);

                // 팀이 날아가기 때문에 멤버db도 날아가고 파일db도 날아간다 (캐스케이드)

                // 하지만 파일을 직접 날리긴 해야해!!
                List<Long> teamSeqList = new ArrayList<>();
                teamSeqList.add(teamSeq);
                if(projectService.deleteProject(teamSeqList).equals("fail!")) {
                    return "error";
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
    public List<UserInfoDto> memberList(String jwt, Long teamSeq) {

        try {

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

                return userInfoDtoList;

            } else {
                return null;
            }

        } catch (Exception e) {
            e.printStackTrace();
            return null;
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
                        return "error";
                    }
                } else {
                    return "403";
                }
            } else {
                return "error";
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
                return "error";
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
                        return "error";
                    }
                } else {
                    return "403";
                }
            } else {
                return "error";
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
                return "error";
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
                        return "error";
                    }
                } else {
                    return "403";
                }
            } else {
                return "error";
            }

        } catch (Exception e) {
            e.printStackTrace();
            return "error";
        }

    }

    // 팀 탈퇴
    public String memberQuit(String jwt, Long teamSeq) {

        try {

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
                return "error";
            }

        } catch (Exception e) {
            e.printStackTrace();
            return "error";
        }

    }


}
