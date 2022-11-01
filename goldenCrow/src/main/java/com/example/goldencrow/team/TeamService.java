package com.example.goldencrow.team;

import com.example.goldencrow.team.dto.TeamDto;
import com.example.goldencrow.team.entity.MemberEntity;
import com.example.goldencrow.team.entity.TeamEntity;
import com.example.goldencrow.team.repository.MemberRepository;
import com.example.goldencrow.team.repository.TeamRepository;
import com.example.goldencrow.user.JwtService;
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
    public List<TeamDto> teamList(String jwt){

        try {

            List<TeamDto> teamDtoList = new ArrayList<>();

            // jwt에서 userSeq를 뽑아내고
            Long userSeq = jwtService.JWTtoUserSeq(jwt);

            // 그 userSeq를 가지는 멤버 엔티티를 뽑아옴
            List<MemberEntity> memberEntities = memberRepository.findAllByUser_UserSeq(userSeq);

            if(!memberEntities.isEmpty()) {
                // 그 모든 엔티티에서 forEach를 돌리면서
                for(MemberEntity m : memberEntities){
                    // 팀 시퀀스를 꺼내옴
                    Long teamSeq = m.getTeam().getTeamSeq();
                    // 해당 팀 엔티티를 뽑아서 리스트에 넣음
                    teamDtoList.add(new TeamDto(teamRepository.findById(teamSeq).get()));
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
            if(teamRepository.findTeamEntityByTeamLeaderAndTeamName(userEntity, teamName).isPresent()) {
                return "duplicate";
            }

            // 이 사람을 팀장으로 하는 팀 생성하고 저장
            TeamEntity teamEntity = new TeamEntity(userEntity, teamName);
            teamRepository.save(teamEntity);

            // 멤버 테이블에도 그 사람을 등록
            TeamEntity savedTeamEntity = teamRepository.findTeamEntityByTeamLeaderAndTeamName(userEntity, teamName).get();
            MemberEntity memberEntity = new MemberEntity(userEntity, savedTeamEntity);
            memberRepository.save(memberEntity);

            // 성공 여부 반환
            return "success";

        } catch (Exception e) {
            e.printStackTrace();
            return "error";
        }

    }

    public String teamModify(String jwt, Long teamSeq, String teamName) {

        try {
            // jwt에서 userSeq를 뽑아내고
            Long userSeq = jwtService.JWTtoUserSeq(jwt);

            Optional<TeamEntity> teamEntityOptional = teamRepository.findByTeamSeqAndTeamLeader_UserSeq(teamSeq, userSeq);

            if(teamEntityOptional.isPresent()){
                TeamEntity teamEntity = teamEntityOptional.get();
                teamEntity.setTeamName(teamName);
                teamRepository.save(teamEntity);
                return "success";
            } else {
                return "401";
            }

        } catch (Exception e) {
            e.printStackTrace();
            return "error";
        }

    }

    public String teamDelete(String jwt, Long teamSeq) {

        try {
            // jwt에서 userSeq를 뽑아내고
            Long userSeq = jwtService.JWTtoUserSeq(jwt);

            Optional<TeamEntity> teamEntityOptional = teamRepository.findByTeamSeqAndTeamLeader_UserSeq(teamSeq, userSeq);

            if(teamEntityOptional.isPresent()){
                TeamEntity teamEntity = teamEntityOptional.get();
                teamRepository.delete(teamEntity);

                // 팀이 날아가기 때문에 멤버db도 날아가고 파일db도 날아간다
                // 하지만 파일을 직접 날리긴 해야해!!

                // 그래서 이쯤에서 restTemplate로 파일 날리는 api를 써야함

                return "success";
            } else {
                return "401";
            }

        } catch (Exception e) {
            e.printStackTrace();
            return "error";
        }

    }
}
