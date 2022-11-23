package com.example.goldencrow.unLogin;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UnLoginService {

    @Autowired
    private UnLoginRepository unLoginRepository;

    public String getSessionId () {
        return "hello";
    }

}
