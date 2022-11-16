package com.example.goldencrow.apiTest;

import com.example.goldencrow.apiTest.dto.ApiTestDto;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

import static com.example.goldencrow.common.Constants.SUCCESS;

/**
 * 사용자의 api의 응답테스트를 처리하는 컨트롤러
 *
 * @url /api/api-test
 */
@RestController
@RequestMapping(value = "/api/api-test")
public class ApiTestController {
    private final ApiTestService apiTestService;

    public ApiTestController(ApiTestService apiTestService) {
        this.apiTestService = apiTestService;
    }

    /**
     * API 응답 테스트 API
     * [EN] Opearting API Communication with variables of ApiTestDto
     * <br>
     * [KR] ApiTestDto의 변수들을 이용해 API 테스트를 진행합니다
     *
     * @param apiTestDto api: URI, type: HTTP Method, request: RequestBody, header: Headers
     * @return If success, return HashMap, "data" key has response body, "time" key: response time with status 200
     * If failed, return status 400
     */
    @PostMapping("")
    public ResponseEntity<Map<String, Object>> apiTest(@RequestBody ApiTestDto apiTestDto) {
        Map<String, Object> res = apiTestService.apiTest(apiTestDto);
        String result = (String) res.get("result");
        if (result.equals(SUCCESS)) {
            return new ResponseEntity<>(res, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(res, HttpStatus.BAD_REQUEST);
        }
    }

}
