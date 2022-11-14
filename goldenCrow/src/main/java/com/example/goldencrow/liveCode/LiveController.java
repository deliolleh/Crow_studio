package com.example.goldencrow.liveCode;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;
import org.springframework.web.util.HtmlUtils;

@Controller
public class LiveController {
    @MessageMapping("/hello")
    @SendTo("/topic/greetings")
    public TestCode greeting(LiveCode message) throws Exception {
        System.out.println("여기야여기!");
        Thread.sleep(1000); // simulated delay
        return new TestCode("Hello, " + HtmlUtils.htmlEscape(message.getName() + "!"));
    }

}
