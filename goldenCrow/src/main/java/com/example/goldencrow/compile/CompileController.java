package com.example.goldencrow.compile;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Objects;

@RestController
@RequestMapping(value = "/api/compile")
public class CompileController {
    private final CompileService compileService;

    public CompileController(CompileService compileService) {
        this.compileService = compileService;
    }

    @PostMapping("/py/{teamSeq}")
    public ResponseEntity<String> pyCompile(@RequestHeader("Authorization") String jwt, @RequestBody Map<String, Object> req, @PathVariable Long teamSeq) {
        String res = compileService.pyCompile(req, teamSeq);
        if (res.startsWith("Error:")) { return new ResponseEntity<>(res, HttpStatus.BAD_REQUEST); }
        else { return new ResponseEntity<>(res, HttpStatus.OK); }

    }

    @PostMapping("/py/stop")
    public ResponseEntity<String> pyCompileStop(@RequestHeader("Authorization") String jwt, @RequestBody Map<String, String> req){
        String res = compileService.pyCompileStop(req);
        if (Objects.equals(res, "SUCCESS")) { return new ResponseEntity<>(res, HttpStatus.OK); }
        else { return new ResponseEntity<>(res, HttpStatus.BAD_REQUEST); }
    }


}
