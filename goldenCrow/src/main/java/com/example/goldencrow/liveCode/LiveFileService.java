package com.example.goldencrow.liveCode;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.stereotype.Service;

@Service
public class LiveFileService {
    @Autowired
    MongoTemplate mongoTemplate;

    public LiveFileEntity insertLive(LiveFileEntity body) {
        System.out.println("durldi durl");
        return mongoTemplate.insert(body);
    }
}
