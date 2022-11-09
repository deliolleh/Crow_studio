package com.example.goldencrow.user.dto;

import lombok.Data;

@Data
public class SettingEditorDto {

    private int fontSize;
    private String font;
    private String autoLine;

    public SettingEditorDto() {
    }

}
