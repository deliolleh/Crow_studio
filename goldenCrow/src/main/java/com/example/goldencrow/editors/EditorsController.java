package com.example.goldencrow.editors;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/editors")
public class EditorsController {

    public EditorsService editorsService;

    public EditorsController(EditorsService editorsService) {
        this.editorsService = editorsService;
    }

    @PostMapping("/format/{language}")
    public ResponseEntity<Map<String, String>> fileFormat(@PathVariable String language, @RequestBody Map<String, String> rawText) {
        String code = rawText.get("text");

        HashMap<String, String> response = editorsService.Formatting(language, code);
        if (response.get("data").equals("null")) {
            System.out.println("formatting Fail");
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        } else {
            System.out.println("formatting Success");
            return ResponseEntity.ok(response);
        }
    }

    @PostMapping("/lint/{language}")
    public ResponseEntity<Map<String, String>> fileLint(@PathVariable String language, @RequestBody Map<String, String> rawText) {
        String code = rawText.get("text");

        HashMap<String, String> response = editorsService.Linting(language, code);
        if (response.get("data").equals("null")) {
            System.out.println("formatting Fail");
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        } else {
            System.out.println("formatting Success");
            return ResponseEntity.ok(response);
        }
    }

    @GetMapping("")
    public ResponseEntity<Map<String, Object>> autoComplete(@RequestParam("find") String letter) {
        HashMap<String, Object> response = editorsService.autoComplete(letter);
        return ResponseEntity.ok(response);
    }
}
