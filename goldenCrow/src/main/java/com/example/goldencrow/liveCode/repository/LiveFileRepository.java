package com.example.goldencrow.liveCode.repository;

import com.example.goldencrow.liveCode.entity.LiveFileEntity;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface LiveFileRepository extends MongoRepository<LiveFileEntity, String> {

}
