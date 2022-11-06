package com.example.goldencrow.team.dto;

import com.example.goldencrow.user.dto.UserInfoDto;
import lombok.Data;

import java.util.List;

@Data
public class UserInfoListDto {

    private String result;

    private List<UserInfoDto> userInfoDtoList;

    public UserInfoListDto() {
    }

    public UserInfoListDto(List<UserInfoDto> userInfoDtos) {
        this.result = "success";
        this.userInfoDtoList = userInfoDtos;
    }
}
