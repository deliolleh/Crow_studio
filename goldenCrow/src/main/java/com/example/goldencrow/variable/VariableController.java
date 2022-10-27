package com.example.goldencrow.variable;

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
    public ResponseEntity<Map<String, Object>> varialbeRecommend(@RequestParam("which") String alphabet) {
        HashMap<String, Object> response = variableService.variableRecommend(alphabet);
        return ResponseEntity.ok(response);
    }
}
