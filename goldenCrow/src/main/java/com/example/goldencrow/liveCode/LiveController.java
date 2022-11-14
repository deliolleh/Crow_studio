package com.example.goldencrow.liveCode;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;
import org.springframework.web.util.HtmlUtils;

@Controller
public class LiveController {
    @MessageMapping("/hello")
    @SendTo("/topic/greetings")
    public testCode greeting(LiveCode message) throws Exception {
        Thread.sleep(1000); // simulated delay
        return new testCode("Hello, " + HtmlUtils.htmlEscape(message.getName() + "!"));
    }

}
