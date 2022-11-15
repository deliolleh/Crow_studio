package com.example.goldencrow.liveCode;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.util.HtmlUtils;

import java.util.Map;

@Controller
public class LiveController {
    private final LiveFileService liveFileService;
    public LiveController(LiveFileService liveFileService) {
        this.liveFileService = liveFileService;
    }
    @MessageMapping("/hello")
    @SendTo("/topic/greetings")
    public TestCode greeting(LiveCode message) throws Exception {
        Thread.sleep(1000); // simulated delay
        return new TestCode("Hello, " + HtmlUtils.htmlEscape(message.getName() + "!"));
    }

    @PostMapping("/api/hi")
    public ResponseEntity<String> testCode (@RequestHeader("Authorization") String jwt, @RequestBody Map<String,String> lfe) {
        LiveFileEntity lfet = new LiveFileEntity(lfe.get("content"),lfe.get("path"));
        liveFileService.insertLive(lfet);
        return new ResponseEntity<>("Hello", HttpStatus.OK);
    }

}
