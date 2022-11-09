package com.example.goldencrow.apiTest.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import org.json.simple.JSONObject;
import org.springframework.util.MultiValueMap;

import java.util.HashMap;

/**
 * api: Request api address
 * <br>
 * type: GET, POST, PUT, DELETE...
 * <br>
 * request: RequestBody
 * <br>
 * header: ex) Authorization, Content-Type...
 */
@Data
@NoArgsConstructor
public class ApiTestDto {

    private String api;

    private String type;

    private JSONObject request;

    private JSONObject header;
}
