package com.example.goldencrow.compile;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.util.Arrays;

/**
 * 자정에 사용자의 Docker Container와 images를 모두 멈추고 삭제하는 서비스
 */
@Service
public class SchedulerService {

    @Autowired
    private CompileService compileService;

    /**
     * 매일 0시 0분 0초에 Docker container와 image를 모두 삭제하는 내부 로직
     */
    @Scheduled(cron = "0 0 0 * * *")
    public void run() {
        // 모든 컨테이너 닫기
        /*
         * 우리가 사용하는 포트(컨테이너)를 제외하고 !
         * 특정 이름을 가진 것만 필터링해서 조회 (crowstudio_)
         * docker stop $(docker container ls --filter='name=crowstudio_' -q)
         * crowstudio_로 시작하는 이미지 모두 삭제
         * docker rmi $(docker images crowstudio_* -q)
         * <none>인 이미지 삭제
         * docker rmi $(docker images -f "dangling=true" -q)
         * 사용하지 않는 이미지 삭제(강경)
         * docker image prune -a -f
         * */
        String filteringName = "crowstudio_";
        String[] containerCmd = {"docker", "container", "ls", "--filter=name=" + filteringName, "-q"};
        String[] containerList = compileService.resultString(containerCmd).split("(\r\n|\r|\n|\n\r)");
        // 삭제할 container가 있으면 삭제
        if (containerList.length != 0) {
            for (String container :
                    containerList) {
                String[] stopCmd = {"docker", "stop", container};
                compileService.resultString(stopCmd);
            }
        }
        // 사용하지 않는 도커 이미지 모두 삭제
        String[] rmImgCmd = {"docker", "image", "prune", "-a", "-f"};
        compileService.resultString(rmImgCmd);
    }
}
