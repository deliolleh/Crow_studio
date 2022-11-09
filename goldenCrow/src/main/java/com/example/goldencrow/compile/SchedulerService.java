package com.example.goldencrow.compile;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.util.Arrays;

@Service
public class SchedulerService {

    @Autowired
    private CompileService compileService;

    @Scheduled(cron = "0 0 0 * * *")
    public void run() {
        System.out.println("now 24:00");
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
        String[] containerCmd = {"docker", "container", "ls", "--filter=name="+filteringName, "-q"};
        String[] containerList = compileService.resultString(containerCmd).split("(\r\n|\r|\n|\n\r)");
        System.out.println("containerList : " + Arrays.toString(containerList));
        if (containerList.length != 0) {
            for (String container:
                    containerList) {
                String[] stopCmd = {"docker", "stop", container};
                System.out.println(Arrays.toString(stopCmd));
                System.out.println("docker stop 시작 !");
                compileService.resultString(stopCmd);
                System.out.println("docker stop 됐다 !");
            }
        }

        String[] rmImgCmd = {"docker", "image", "prune", "-a", "-f"};
        System.out.println("docker images 삭제 시작 !");
        compileService.resultString(rmImgCmd);
        System.out.println("docker images 삭제 됐다 !");
    }
}
