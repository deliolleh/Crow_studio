package com.example.goldencrow.team;

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

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

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

    // 팀 조회
    public List<TeamDto> teamList(String jwt) {

        try {

            List<TeamDto> teamDtoList = new ArrayList<>();

            // jwt에서 userSeq를 뽑아내고
            Long userSeq = jwtService.JWTtoUserSeq(jwt);

            // 그 userSeq를 가지는 멤버 엔티티를 뽑아옴
            List<MemberEntity> memberEntities = memberRepository.findAllByUser_UserSeq(userSeq);

            if (!memberEntities.isEmpty()) {
                // 그 모든 엔티티에서 forEach를 돌리면서
                for (MemberEntity m : memberEntities) {
                    // 해당 팀 엔티티를 뽑아서 리스트에 넣음
                    teamDtoList.add(new TeamDto(m.getTeam()));
                }
            }

            return teamDtoList;

        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }

    }

    // 팀 생성
    public String teamCreate(String jwt, String teamName) {

        try {
            // jwt에서 userSeq를 뽑아내고
            Long userSeq = jwtService.JWTtoUserSeq(jwt);
            // userSeq로 userEntity를 뽑아낸 다음
            UserEntity userEntity = userRepository.findById(userSeq).get();

            // 중복되는 것이 있는지 확인
            // 있으면 리턴 듀플리케이트
            if (teamRepository.findTeamEntityByTeamLeaderAndTeamName(userEntity, teamName).isPresent()) {
                return "duplicate";
            }

            // 이 사람을 팀장으로 하는 팀 생성하고 저장
            TeamEntity teamEntity = new TeamEntity(userEntity, teamName);
            teamRepository.saveAndFlush(teamEntity);

            // 멤버 테이블에도 그 사람을 등록
            TeamEntity savedTeamEntity = teamRepository.findTeamEntityByTeamLeaderAndTeamName(userEntity, teamName).get();
            MemberEntity memberEntity = new MemberEntity(userEntity, savedTeamEntity);
            memberRepository.saveAndFlush(memberEntity);

            // 성공 여부 반환
            return "success";

        } catch (Exception e) {
            e.printStackTrace();
            return "error";
        }

    }

    // 팀(명) 수정
    public String teamModify(String jwt, Long teamSeq, String teamName) {

        try {
            // jwt에서 userSeq를 뽑아내고
            Long userSeq = jwtService.JWTtoUserSeq(jwt);

            Optional<TeamEntity> teamEntityOptional = teamRepository.findByTeamSeqAndTeamLeader_UserSeq(teamSeq, userSeq);

            if (teamEntityOptional.isPresent()) {
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

                // 그래서 이쯤에서 restTemplate로 파일 날리는 api를 써야함

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


}
