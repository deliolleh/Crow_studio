package com.example.goldencrow.variable;

import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.LinkedList;

@Service
public class VariableService {
    public HashMap<String , Object> variableRecommend(String text) {
        System.out.println(text);
        HashMap<String, Object> result = new HashMap<>();
        LinkedList<String> response = new LinkedList<>();
        response.add("text");
        response.add("변수명 추천");
        response.add("통신 성공");

        result.put("data", response);
        return result;
    }
}
