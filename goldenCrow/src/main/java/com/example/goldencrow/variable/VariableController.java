package com.example.goldencrow.variable;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/variable")
public class VariableController {

    public VariableService variableService;

    public VariableController(VariableService variableService) {
        this.variableService = variableService;
    }

    /**
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
        } else {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }

    }
}
