package com.example.goldencrow.liveCode.service;

import com.example.goldencrow.liveCode.dto.FileContentSaveDto;
import com.example.goldencrow.liveCode.entity.LiveFileEntity;
import com.example.goldencrow.liveCode.repository.LiveFileRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class LiveFileService {
    @Autowired
    MongoTemplate mongoTemplate;
    @Autowired
    public LiveFileRepository liveFileRepository;

    public FileContentSaveDto insertLive(FileContentSaveDto body) {
        Optional<LiveFileEntity> lfe = liveFileRepository.findByPath(body.getPath());
        LiveFileEntity liveFileEntity;

        if (!lfe.isPresent()) {
            liveFileEntity = mongoTemplate.insert(lfe.get());
        } else {
            lfe.get().setContent(body.getContent());
            liveFileEntity = liveFileRepository.save(lfe.get());
        }

        FileContentSaveDto fileContentSaveDto = new FileContentSaveDto(liveFileEntity.getContent(), liveFileEntity.getPath());

        return fileContentSaveDto;
    }
}
