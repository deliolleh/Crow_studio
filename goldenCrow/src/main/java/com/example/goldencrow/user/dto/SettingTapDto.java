package com.example.goldencrow.user.dto;

import lombok.Data;

@Data
public class SettingTapDto {

    private String name;
    private String path;
    private int icon;

    public SettingTapDto() {
    }

}