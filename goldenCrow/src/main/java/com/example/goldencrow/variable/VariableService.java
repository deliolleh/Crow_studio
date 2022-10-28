package com.example.goldencrow.variable;


import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.springframework.http.HttpMethod;
import org.springframework.http.RequestEntity;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import java.net.URI;
import java.util.ArrayList;
import java.util.HashMap;


@Service
public class VariableService {

    public RestTemplate restTemplate = new RestTemplate();
    String clientId = "p3IEa7WNGODfNQkwb1z2";
    String clientSecret = "MSAQnEbctM";

    public HashMap<String, Object> variableRecommend(String text) {
//        System.out.println(text);
        HashMap<String, Object> result = new HashMap<>();
        ArrayList<String> responses = new ArrayList<>();

        String papago = papagoApi(text);
        responses.add(papago);

        result.put("data", responses);
        return result;
    }

    public String papagoApi(String word) {
        String response = "";

        URI uri;

        uri = UriComponentsBuilder
                .fromUriString("https://openapi.naver.com")
                .path("/v1/papago/n2mt").queryParam("source", "ko")
                .queryParam("target", "en")
                .queryParam("text", word)
                .build()
                .toUri();


        RequestEntity<Void> requestEntity = naverHeader(uri);

        ResponseEntity<String> result = restTemplate.exchange(uri.toString(), HttpMethod.POST, requestEntity, String.class);

        try {
            JSONParser jsonParser = new JSONParser();
            JSONObject jsonObject = (JSONObject) jsonParser.parse(result.getBody());
            JSONObject jsonObject1 = (JSONObject) jsonObject.get("message");
            JSONObject jsonObject2 = (JSONObject) jsonObject1.get("result");
            response = jsonObject2.get("translatedText").toString();
        } catch (Exception e) {
            e.printStackTrace();
        }

        System.out.println(response);
        return response;

    }

    private RequestEntity<Void> naverHeader(URI uri) {
        return RequestEntity
                .get(uri)
                .header("X-Naver-Client-Id", clientId)
                .header("X-Naver-Client-Secret", clientSecret)
                .build();
    }
}
