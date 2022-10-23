package com.ssafy.crowstudio.piece.dto;

import com.ssafy.crowstudio.piece.Entity.TagEntity;
import lombok.Data;

@Data
public class TagDto {

    private Long tagSeq;
    private String tagTitle;
    private String tagImg;
    private String tagDesc;

    public TagDto(){}

    public TagDto(TagEntity tagEntity){
        this.tagSeq = tagEntity.getTagSeq();
        this.tagTitle = tagEntity.getTagTitle();
        this.tagImg = tagEntity.getTagImg();
        this.tagDesc = tagEntity.getTagDesc();
    }

}
