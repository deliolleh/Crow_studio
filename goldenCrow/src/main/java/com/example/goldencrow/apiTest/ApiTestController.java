package com.example.goldencrow.apiTest;

import com.example.goldencrow.apiTest.dto.ApiTestDto;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping(value = "/api/api-test")
public class ApiTestController {
    private final ApiTestService apiTestService;

    public ApiTestController(ApiTestService apiTestService) {
        this.apiTestService = apiTestService;
    }

    @PostMapping("")
    public ResponseEntity<Map<String, Object>> apiTest(@RequestBody ApiTestDto apiTestDto) {
        Map<String, Object> result = apiTestService.apiTest(apiTestDto);
        if (result.get("data").equals("ERROR")) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        } else {
            return new ResponseEntity<>(result, HttpStatus.OK);
        }
    }

}
