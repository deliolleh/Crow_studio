package com.example.goldencrow.user.dto;

import lombok.Data;

import java.util.List;

@Data
public class SettingsDto {

    private int horizonSplit;
    private int verticalSplit;
    private List<SettingTapDto> lastTabLeft;
    private List<SettingTapDto> lastTabRight;
    private int lastSideBar;
    private SettingEditorDto editors;
    private SettingConsoleDto consoles;
    private String result;

    public SettingsDto() {
    }

}
