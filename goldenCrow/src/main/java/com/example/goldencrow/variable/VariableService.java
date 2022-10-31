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
        ArrayList<String> words = new ArrayList<>();

        String papago = papagoApi(text);
        words.add(papago);
//        String google =

        ArrayList<String> converts = new ArrayList<>();

        for (String word : words) {
            String[] letters = word.split(" ");
            int len = letters.length;
            int i;
            StringBuilder camel = new StringBuilder();
            StringBuilder pascal = new StringBuilder();
            StringBuilder snake = new StringBuilder();
            for (i = 0; i < len; i++) {
                if (letters[i].equals("%20")) {
                    System.out.println();
                } else if (i == 0) {
                    camel.append(letters[i].toLowerCase());
                    pascal.append(letters[i].substring(0, 1).toUpperCase()).append(letters[i].substring(1).toLowerCase());
                    snake.append(letters[i].toLowerCase());
                } else {
                    camel.append(letters[i].substring(0, 1).toUpperCase()).append(letters[i].substring(1));
                    pascal.append(letters[i].substring(0, 1).toUpperCase()).append(letters[i].substring(1));
                    snake.append("_").append(letters[i].toLowerCase());
                }

            }

            converts.add(camel.toString());
            converts.add(pascal.toString());
            converts.add(snake.toString());
            System.out.println(camel);
            System.out.println(pascal);
            System.out.println(snake);
//            String word2 = word.replace("[a,e,i,o,u, A, E, I, O, U]", "");

        }

        result.put("data", converts);
        return result;
    }

    public String papagoApi(String word) {
        String response = "";

        URI uri = UriComponentsBuilder
                .fromUriString("https://openapi.naver.com")
                .path("/v1/papago/n2mt")
                .queryParam("source", "ko")
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

//    public String googleApi(String word) {
//        String key = "AIzaSyAyIwR6h1kVLg7b-cKpeB5Xm6nUza4aj3M";
//        String targetLanguage = "en";
//        String projectId = "teamgoldencrow";
//
//        try (TranslationServiceClient client = TranslationServiceClient.create()) {
//            LocationName parent = LocationName.of(projectId, "global");
//
//            TranslateTextRequest request =
//                    TranslateTextRequest.newBuilder()
//                            .setParent(parent.toString())
//                            .setMimeType("text/plain")
//                            .setTargetLanguageCode(targetLanguage)
//                            .addContents(word)
//                            .build();
//
//            TranslateTextResponse response = client.translateText(request);
//
//            for (Translation translation : response.getTranslationsList()) {
//                System.out.println("Google " + translation.getTranslatedText());
//            }
//        } catch (IOException e) {
//            e.printStackTrace();
//        }
//
//        return "1";
//
//    }
}
