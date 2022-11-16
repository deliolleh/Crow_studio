package com.example.goldencrow.editor;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/editors")
public class EditorsController {

    public EditorsService editorsService;

    public EditorsController(EditorsService editorsService) {
        this.editorsService = editorsService;
    }

    /**
     * Formatting code
     *
     * @param language Python, javascript, JAVA...
     * @param rawText  Code from editor
     * @return If success,
     * <br>Hashmap - "data": formatting code file name
     * <br>Nothing if failed
     */
    @PostMapping("/format/{language}")
    public ResponseEntity<Map<String, String>> fileFormat(@PathVariable String language,
                                                          @RequestBody Map<String, String> rawText) {
        System.out.println("get text");
        System.out.println(language);
        System.out.println(rawText);
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

    /**
     * Get reformatted Code
     *
     * @param language Python, javascript, JAVA...
     * @param rawData  name: fileName get by fileFormat
     * @return If success,
     * <br>Hashmap - "data": formatted code
     * <br>Nothing if failed
     */
    @PostMapping("/format/read/{language}")
    public ResponseEntity<Map<String, String>> formatResult(@PathVariable String language, @RequestBody HashMap<String, String> rawData) {
        String name = rawData.get("name"); // format 파일을 만든 시간
        HashMap<String, String> response = editorsService.FormatRead(language, name);
        if (response.get("data").equals("null")) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        } else {
            return new ResponseEntity<>(response, HttpStatus.OK);
        }
    }

    /**
     * Check Your Code, Not Change
     *
     * @param language Python, javascript, JAVA...
     * @param rawText  Code from editor
     * @return data: show what is problem / LinkedList
     * <br> index: problems index / ArrayList
     */
    @PostMapping("/lint/{language}")
    public ResponseEntity<Map<String, Object>> fileLint(@PathVariable String language, @RequestBody Map<String, String> rawText) {
        String code = rawText.get("text");

        HashMap<String, Object> response = editorsService.Linting(language, code);
        if (response.get("data").equals("null")) {
            System.out.println("lint Fail");
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        } else {
            System.out.println("lint Success");
            return new ResponseEntity<>(response, HttpStatus.OK);
        }
    }

    @GetMapping("")
    public ResponseEntity<Map<String, Object>> autoComplete(@RequestParam("find") String letter) {
        HashMap<String, Object> response = editorsService.autoComplete(letter);
        return ResponseEntity.ok(response);
    }
}
