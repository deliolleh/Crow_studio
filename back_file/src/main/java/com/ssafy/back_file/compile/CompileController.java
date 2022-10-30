package com.ssafy.back_file.compile;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.Map;

@RestController
@RequestMapping(value = "/api-file/compile")
public class CompileController {
    private final CompileService compileService;

    public CompileController(CompileService compileService) {
        this.compileService = compileService;
    }

    @PostMapping("/py")
    public ResponseEntity<String> pyCompile(@RequestBody Map<String, String> req) {
        String res = compileService.pyCompile(req);
        return new ResponseEntity<>(res, HttpStatus.OK);

    }


}
