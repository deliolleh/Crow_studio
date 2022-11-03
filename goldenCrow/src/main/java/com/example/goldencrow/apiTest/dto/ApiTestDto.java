package com.example.goldencrow.apiTest.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import org.json.simple.JSONObject;
import org.springframework.util.MultiValueMap;

import java.util.HashMap;

@Data
@NoArgsConstructor
public class ApiTestDto {

    private String api;

    private String type;

    private JSONObject request;

    private JSONObject header;
}
