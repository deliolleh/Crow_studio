package com.example.goldencrow.compile;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping(value = "/api/compile")
public class CompileController {
    private final CompileService compileService;

    public CompileController(CompileService compileService) {
        this.compileService = compileService;
    }

    @PostMapping("/py/{teamSeq}")
    public ResponseEntity<String> pyCompile(@RequestHeader("Authorization") String jwt, @RequestBody Map<String, String> req, @PathVariable Long teamSeq) {
        String res = compileService.pyCompile(req, teamSeq);
        return new ResponseEntity<>(res, HttpStatus.OK);

    }


}
