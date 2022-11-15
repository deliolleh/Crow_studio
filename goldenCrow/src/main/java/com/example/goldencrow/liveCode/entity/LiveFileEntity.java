package com.example.goldencrow.liveCode.entity;

import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.core.mapping.Document;

import javax.persistence.*;
import java.sql.Clob;
import java.util.ArrayList;
import java.util.List;

@Document(collection = "liveFile")
@Getter
public class LiveFileEntity {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private ObjectId liveFileSeq;

    @Lob
    private String content;

    private String path;


    @Builder
    public LiveFileEntity(String content, String path) {
        this.content = content;
        this.path = path;
    }
}