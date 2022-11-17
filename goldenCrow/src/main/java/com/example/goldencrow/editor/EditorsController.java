package com.example.goldencrow.editor;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

import static com.example.goldencrow.common.Constants.*;

/**
 * 파일의 내용을 포맷팅(formatting)하거나 린트(lint)하는 컨트롤러
 * 포맷팅(formmating) : 사용자의 코드를 PEP8 guide에 맞게 수정하는 기능
 * 린트(lint) : 사용자의 오류를 바로잡아 수정하는 기능
 */
@RestController
@RequestMapping("/api/editors")
public class EditorsController {

    public EditorsService editorsService;

    public EditorsController(EditorsService editorsService) {
        this.editorsService = editorsService;
    }

    /**
     * 포맷팅 API
     * Formatting code
     *
     * @param language  해당 파일의 언어 종류 ex. python, text
     * @param req       "name" 을 key로 가지는 Map<String, String>
     * @return 포맷팅 처리를 한 temp 파일의 제목, 성패에 따른 result 반환
     * @status 200, 400, 401
     */
    @PostMapping("/format/{language}")
    public ResponseEntity<Map<String, String>> fileFormat(@PathVariable String language,
                                                          @RequestBody Map<String, String> req) {
        String code = req.get("text");
        Map<String, String> res = editorsService.formatService(language, code);
        if (res.get("result").equals(SUCCESS)) {
            return new ResponseEntity<>(res, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(res, HttpStatus.BAD_REQUEST);
        }
    }

    /**
     * 포맷팅 결과 조회 API
     * Get reformatted Code
     *
     * @param language  해당 파일의 언어 종류 ex. python, text
     * @param req       "name"(fileName get by fileFormat) 를 key로 가진 Map<String, String>
     * @return 포맷팅한 결과 코드를 반환, 성패에 따른 result 반환
     * @status 200, 400, 401, 404
     */
    @PostMapping("/format/read/{language}")
    public ResponseEntity<Map<String, String>> formatResult(@PathVariable String language, @RequestBody Map<String, String> req) {
        String name = req.get("name");
        Map<String, String> res = editorsService.formatRead(language, name);
        String result = res.get("result");
        switch (result) {
            case SUCCESS:
                return new ResponseEntity<>(res, HttpStatus.OK);
            case NO_SUCH:
                return new ResponseEntity<>(res, HttpStatus.NOT_FOUND);
            default:
                return new ResponseEntity<>(res, HttpStatus.BAD_REQUEST);
        }
    }

    /**
     * 사용자의 코드에 린트를 적용해 해당 에러와 해당 인덱스를 반환하는 API
     * Check Your Code, Not Change
     *
     * @param language  해당 파일의 언어 종류 ex. python, text
     * @param req       "name"(fileName get by fileFormat) 를 key로 가진 Map<String, String>
     * @return 린트한 결과를 해당 index와 관련 내용을 반환, 성패에 따른 result 반환
     * @status 200, 400, 401, 404
     */
    @PostMapping("/lint/{language}")
    public ResponseEntity<Map<String, Object>> fileLint(@PathVariable String language, @RequestBody Map<String, String> req) {
        String code = req.get("text");
        Map<String, Object> res = editorsService.lintService(language, code);
        String result = (String) res.get("result");
        switch (result) {
            case SUCCESS:
                return new ResponseEntity<>(res, HttpStatus.OK);
            case NO_SUCH:
                return new ResponseEntity<>(res, HttpStatus.NOT_FOUND);
            default:
                return new ResponseEntity<>(res, HttpStatus.BAD_REQUEST);
        }
    }

}
