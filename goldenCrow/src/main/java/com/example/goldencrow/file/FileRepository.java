package com.example.goldencrow.file;

import com.example.goldencrow.file.FileEntity;
import org.bson.types.ObjectId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface FileRepository extends MongoRepository<FileEntity, ObjectId> {
    /** 시퀀스로 단일 파일 조회  */
    Optional<FileEntity> findById(ObjectId id);

    /**
     * 팀 시퀀스랑 파일 경로로 파일(디렉토리) 조회
     */
    Optional<FileEntity> findByTeamSeqAndFilePath(Long teamSeq, String filePath);
//    /** 팀 시퀀스랑 파일 이름으로 파일 조회 */
//    FileEntity findByTeamSeqAndFileTitle(Long teamSeq, String fileTitle);

}