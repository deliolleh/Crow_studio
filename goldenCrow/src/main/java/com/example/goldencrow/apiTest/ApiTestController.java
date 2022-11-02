package com.example.goldencrow.apiTest;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping(value = "/api-file/api-test")
public class ApiTestController {
    private final ApiTestService apiTestService;

    public ApiTestController(ApiTestService apiTestService) {
        this.apiTestService = apiTestService;
    }

    @PostMapping("")
    public ResponseEntity<Map<String, Object>> apiTest(@RequestBody Map<String, Object> req) {
        Map<String, Object> res = apiTestService.apiTest(req);
        return new ResponseEntity<>(res, HttpStatus.OK);
    }

}
