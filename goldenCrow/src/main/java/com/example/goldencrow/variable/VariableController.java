package com.example.goldencrow.variable;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

import static com.example.goldencrow.common.Constants.*;

/**
 * 변수명을 추천하는 컨트롤러
 *
 * @url /api/variable
 */

@RestController
@RequestMapping("/api/variable")
public class VariableController {

    public VariableService variableService;

    public VariableController(VariableService variableService) {
        this.variableService = variableService;
    }

    /**
<<<<<<< HEAD
     * 변수명 추천 API
     * access token 필요
     *
     * @param req "data"를 key로 가지는 Map<String, String>
     * @return 추천하는 변수명 리스트 (camelCase, PascalCase, snake_case) 반환, 성패에 따른 result 반환
     * @status 200, 400, 401, 404
     *
     * */
    @PostMapping("")
    public ResponseEntity<Map<String, Object>> variableRecommend(@RequestBody HashMap<String, String> req) {
        if (req.containsKey("data")) {
            String data = req.get("data");
            Map<String, Object> res = variableService.variableRecommend(data);
            String result = (String) res.get("result");
            if (result.equals(SUCCESS)) {
                return new ResponseEntity<>(res, HttpStatus.OK);
            } else {
                return new ResponseEntity<>(res, HttpStatus.NOT_FOUND);
            }
=======
     * Recommending Variable Name from KR to EN with Naming Convention
     * <br> camelCase, PascalCase, snake_case
     *
     * @param alphabet In data key, get korean word
     * @return If success, data key has list of three types naming convention with EN translate
     */
    @PostMapping("")
    public ResponseEntity<Map<String, Object>> variableRecommend(@RequestBody HashMap<String, String> alphabet) {
        String text = alphabet.get("data");
        HashMap<String, Object> response = variableService.variableRecommend(text);
        if (response.get("data") != null) {
            return ResponseEntity.ok(response);
>>>>>>> 554358d6ef72e62a311b25937821dd557a60dd0d
        } else {
            Map<String, Object> res = new HashMap<>();
            res.put("result", BAD_REQ);
            return new ResponseEntity<>(res, HttpStatus.BAD_REQUEST);
        }
    }
}
