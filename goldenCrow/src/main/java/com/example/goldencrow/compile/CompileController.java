package com.example.goldencrow.compile;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

import static com.example.goldencrow.common.Constants.*;

/**
 * 파일 혹은 프로젝트의 컴파일을 처리하는 컨트롤러
 *
 * @url /api/compile
 */
@RestController
@RequestMapping(value = "/api/compile")
public class CompileController {
    private final CompileService compileService;

    public CompileController(CompileService compileService) {
        this.compileService = compileService;
    }
    /**
     * 컴파일 API
     * access token 필요
     *
     * @param jwt 회원가입 및 로그인 시 발급되는 access token
     * @param req "type", "filePath" ,"input"을 key로 가지는 Map<String, String>
     * @return 컴파일 성공 시 컴파일 결과 반환, 성패에 따른 result 반환
     * @status 200, 400, 401, 404
     */
    @PostMapping("/py")
    public ResponseEntity<Map<String, String>> pyCompile(@RequestHeader("Authorization") String jwt,
                                                         @RequestBody Map<String, String> req) {

        if(req.containsKey("type") && req.containsKey("filePath") && req.containsKey("input")) {
            String type =  req.get("type");
            String filePath = req.get("filePath");
            String input = req.get("input");
            Map<String, String> res = compileService.pyCompileService(type, filePath, input);
            String result = res.get("result");
            switch (result) {
                case SUCCESS:
                    return new ResponseEntity<>(res, HttpStatus.OK);
                case NO_SUCH:
                    return new ResponseEntity<>(res, HttpStatus.NOT_FOUND);
                default:
                    return new ResponseEntity<>(res, HttpStatus.BAD_REQUEST);
            }
        } else {
            Map<String, String> res = new HashMap<>();
            res.put("result", BAD_REQ);
            return new ResponseEntity<>(res, HttpStatus.BAD_REQUEST);
        }
    }

    /**
     * 컴파일 중지 API
     * access token 필요
     *
     * @param jwt 회원가입 및 로그인 시 발급되는 access token
     * @param req "projectName", "teamSeq"을 key로 가지는 Map<String, String>
     * @return 성패에 따른 result 반환
     * @status 200, 400, 401, 404
     */
    @PostMapping("/py/stop")
    public ResponseEntity<Map<String, String>> pyCompileStop(@RequestHeader("Authorization") String jwt,
                                                             @RequestBody Map<String, String> req) {

        if (req.containsKey("projectName") && req.containsKey("teamSeq")) {
            String projectName = req.get("projectName");
            String teamSeq = req.get("teamSeq");
            Map<String, String> res = compileService.pyCompileStopService(projectName, teamSeq);
            String result = res.get("result");
            switch (result) {
                case SUCCESS:
                    return new ResponseEntity<>(res, HttpStatus.OK);
                case NO_SUCH:
                    return new ResponseEntity<>(res, HttpStatus.NOT_FOUND);
                default:
                    return new ResponseEntity<>(res, HttpStatus.BAD_REQUEST);
            }
        } else {
            Map<String, String> res = new HashMap<>();
            res.put("result", BAD_REQ);
            return new ResponseEntity<>(res, HttpStatus.BAD_REQUEST);
        }
    }


}
