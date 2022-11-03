package com.example.goldencrow.apiTest;

import com.example.goldencrow.apiTest.dto.ApiTestDto;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpMethod;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

import java.time.Duration;
import java.util.HashMap;
import java.util.Map;

@Service
public class ApiTestService {

    @Bean
    public RestTemplate restTemplate() {
        return new RestTemplateBuilder()
                .setConnectTimeout(Duration.ofSeconds(5))
                .setReadTimeout(Duration.ofSeconds(5))
                .build();
    }

    public RestTemplate restTemplate = restTemplate();

    public Map<String, Object> apiTest(ApiTestDto apiTestDto) {
        String api = apiTestDto.getApi();
        String type = apiTestDto.getType();
        JSONObject objRequest = apiTestDto.getRequest();
        JSONObject objHeaders = apiTestDto.getHeader();

        ObjectMapper objectMapper = new ObjectMapper();
        Map<String, String> mapHeader = objectMapper.convertValue(objHeaders, Map.class);
        MultiValueMap<String, String> headers = new LinkedMultiValueMap<>();
        headers.setAll(mapHeader);

        HttpEntity<String> requestOne = new HttpEntity<>(objRequest.toJSONString(), headers);

        Map<String, Object> result = new HashMap<>();

        try {
            Object response;
            long beforeTime = System.currentTimeMillis();
            switch (type.toUpperCase()) {
                case "GET":
//                result = restTemplate.getForObject(api, Object.class, requestOne);
                    response = restTemplate.exchange(api, HttpMethod.GET, requestOne, Object.class);
                    break;

                case "POST":
//                result = restTemplate.postForObject(api, requestOne, Object.class);
                    response = restTemplate.exchange(api, HttpMethod.POST, requestOne, Object.class);
                    break;

                case "PUT":
                    response = restTemplate.exchange(api, HttpMethod.PUT, requestOne, Object.class);
                    break;

                default:
                    response = restTemplate.exchange(api, HttpMethod.DELETE, requestOne, Object.class);
                    break;
            }
            long afterTime = System.currentTimeMillis();
            long diffTime = afterTime - beforeTime;
            HashMap<String,Object> body = new ObjectMapper().convertValue(response, HashMap.class);
            result.put("data", body.get("body"));
            result.put("time", diffTime);
        } catch (Exception e) {
            e.printStackTrace();
            result.put("data", "ERROR");
        }

        return result;
    }
}
