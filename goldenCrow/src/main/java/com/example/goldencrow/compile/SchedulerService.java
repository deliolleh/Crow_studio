package com.example.goldencrow.compile;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

@Service
public class SchedulerService {

    private CompileService compileService;

    @Scheduled(cron = "0 40 * * * *")
    public void run() {
        System.out.println("hi i'm working");
        // 모든 컨테이너 닫기
        /*
        * 우리가 사용하는 포트(컨테이너)를 제외하고 !
        * 특정 이름을 가진 것만 필터링해서 조회 (crowstudio_)
        * docker stop $(docker container ls --filter='name=crowstudio_' -q)
        * crowstudio_로 시작하는 이미지 모두 삭제
        * docker rmi $(docker images crowstudio_* -q)
        * <none>인 이미지 삭제
        * docker rmi $(docker images -f "dangling=true" -q)
        * */
        String filteringName = "crowstudio_";
        String[] stopCmd = {"docker", "stop", "$(docker container ls --filter='name="+ filteringName +"' -q)"};
        String stoped = compileService.resultString(stopCmd);
        System.out.println(stoped);
        String[] rmImgCmd = {"docker", "rmi", "$(docker images "+ filteringName +"* -q)"};
        String removed = compileService.resultString(rmImgCmd);
        System.out.println(removed);
        String[] rmNoneCmd = {"docker", "rmi", "$(docker images -f \"dangling=true\" -q)"};
        String removedNone = compileService.resultString(rmNoneCmd);
        System.out.println(removedNone);
    }
}
