package com.example.goldencrow.unLogin;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

@RestController
@RequestMapping(value = "/api/unlogin")
public class UnLoginController {
    @GetMapping("/")
    public ResponseEntity<String> getSessionId(HttpServletRequest request) {
        HttpSession session = request.getSession(true);

        return new ResponseEntity<>(session.getId(), HttpStatus.OK);
    }
}
