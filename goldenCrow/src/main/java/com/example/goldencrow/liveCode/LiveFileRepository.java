package com.example.goldencrow.liveCode;

import org.springframework.data.mongodb.repository.MongoRepository;

public interface LiveFileRepository extends MongoRepository<LiveFileEntity, String> {

}
