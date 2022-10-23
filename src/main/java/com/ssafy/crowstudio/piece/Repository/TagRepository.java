package com.ssafy.crowstudio.piece.Repository;

import com.ssafy.crowstudio.piece.Entity.TagEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TagRepository extends JpaRepository<TagEntity,Long> {

}
