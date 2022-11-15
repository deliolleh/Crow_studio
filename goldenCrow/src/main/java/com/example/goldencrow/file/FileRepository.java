package com.example.goldencrow.file;

import com.example.goldencrow.file.FileEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface FileRepository extends JpaRepository<FileEntity, Long> {
    /** 시퀀스로 단일 파일 조회  */
    Optional<FileEntity> findByFileSeq(Long fileSeq);

    /**
     * 팀 시퀀스랑 파일 경로로 파일(디렉토리) 조회
     */
    Optional<FileEntity> findByTeam_TeamSeqAndFilePath(Long teamSeq, String filePath);
//    /** 팀 시퀀스랑 파일 이름으로 파일 조회 */
//    FileEntity findByTeamSeqAndFileTitle(Long teamSeq, String fileTitle);

}