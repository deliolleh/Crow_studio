package com.example.goldencrow.liveCode.controller;

import com.example.goldencrow.liveCode.dto.FileContentSaveDto;
import com.example.goldencrow.liveCode.service.LiveFileService;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

import java.util.Map;

@Controller
@RequiredArgsConstructor
public class SocketController {
    private final LiveFileService liveFileService;

    /**
     * 내용을 입력받은 다음, DB에 있는 content를 업데이트
     * @param body FileContentSaveDto
     * @return
     * @throws Exception
     */
    @MessageMapping("/share/{teamSeq}/{fileName}")
    @SendTo("/topic/{teamSeq}/{fileName}")
    public FileContentSaveDto saveContent(@DestinationVariable Long teamSeq, @DestinationVariable String fileName, Map<String,String> body) throws Exception {
        Thread.sleep(1000);
        FileContentSaveDto fileContentSaveDto = new FileContentSaveDto(body.get("content"), body.get("path"));
        liveFileService.insertLive(fileContentSaveDto);
        return fileContentSaveDto;
    }
}
