package com.example.goldencrow.liveCode.controller;

import com.example.goldencrow.liveCode.dto.FileContentSaveDto;
import com.example.goldencrow.liveCode.entity.LiveCode;
import com.example.goldencrow.liveCode.entity.LiveFileEntity;
import com.example.goldencrow.liveCode.entity.TestCode;
import com.example.goldencrow.liveCode.service.LiveFileService;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;
import org.springframework.web.util.HtmlUtils;

import java.io.File;

@Controller
@RequiredArgsConstructor
public class SocketController {
    private final LiveFileService liveFileService;

    @MessageMapping("/saveContent")
    @SendTo("/topic/fileContent")
    public FileContentSaveDto saveContent(FileContentSaveDto body) throws Exception {
        Thread.sleep(200); // simulated delay
        FileContentSaveDto fileContentSaveDto = new FileContentSaveDto(body.getContent(), body.getPath());
        liveFileService.insertLive(fileContentSaveDto);
        return fileContentSaveDto;
    }
}
