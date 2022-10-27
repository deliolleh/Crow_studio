package com.ssafy.back_file.apiTest;

import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class ApiTestService {
    public Map<String, Object> apiTest(Map<String, Object> req) {
        String status = "200 OK (status)";
        String time = String.format("request : %s, %s api %s 응답시간 결과", req.get("request"), req.get("api"), req.get("type"));
        Map<String, Object> response = new HashMap<>();
        response.put("응답 받을 키 1", "응답 받은 내용 1");
        response.put("응답 받을 키 2", "응답 받은 내용 2");
        Map<String, Object> res = new HashMap<>();
        res.put("status", status);
        res.put("time", time);
        res.put("response", response);
        return res;
    }
}
