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

    @GetMapping("")
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
