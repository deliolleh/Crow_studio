package com.ssafy.back_file.File.Repository;

import com.ssafy.back_file.File.FileEntity;
import com.ssafy.back_file.Team.TeamEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface FileRepository extends JpaRepository<FileEntity, Long> {
    /** 시퀀스로 단일 파일 조회  */
    FileEntity findByFileSeq(Long fileSeq);

    /**
     * 팀 시퀀스랑 파일 경로로 파일(디렉토리) 조회
     */
    FileEntity findByTeamAndFilePath(TeamEntity team, String filePath);
//    /** 팀 시퀀스랑 파일 이름으로 파일 조회 */
//    FileEntity findByTeamSeqAndFileTitle(Long teamSeq, String fileTitle);

}