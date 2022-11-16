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
     * @param req "type", "projectName", "teamSeq" ,"input"을 key로 가지는 Map<String, Object>
     * @return 컴파일 성공 시 컴파일 결과 반환, 성패에 따른 result 반환
     * @status 200, 400, 401, 404
     */
    @PostMapping("/py")
    public ResponseEntity<Map<String, String>> pyCompile(@RequestHeader("Authorization") String jwt,
                                                         @RequestBody Map<String, Object> req) {

        if(req.containsKey("type") && req.containsKey("projectName")
                && req.containsKey("teamSeq") && req.containsKey("input")) {
            int type = (int) req.get("type");
            String projectName = (String) req.get("projectName");
            Long teamSeq = (Long) req.get("teamSeq");
            String input = (String) req.get("input");
            Map<String, String> res = compileService.pyCompile(type, projectName, teamSeq, input);
            String result = res.get("result");
            if (result.equals(SUCCESS)) {
                return new ResponseEntity<>(res, HttpStatus.OK);
            } else if (result.equals(NO_SUCH)) {
                return new ResponseEntity<>(res, HttpStatus.NOT_FOUND);
            } else {
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
     * @param req "projectName", "teamSeq"
     * @return 성패에 따른 result 반환
     * @status 200, 400, 401, 404
     */
    @PostMapping("/py/stop")
    public ResponseEntity<Map<String, String>> pyCompileStop(@RequestHeader("Authorization") String jwt,
                                                             @RequestBody Map<String, String> req) {

        if (req.containsKey("projectName") && req.containsKey("teamSeq")) {
            String projectName = req.get("projectName");
            String teamSeq = req.get("teamSeq");
            Map<String, String> res = compileService.pyCompileStop(projectName, teamSeq);
            String result = res.get("result");
            if (result.equals(SUCCESS)) {
                return new ResponseEntity<>(res, HttpStatus.OK);
            } else if (result.equals(NO_SUCH)) {
                return new ResponseEntity<>(res, HttpStatus.NOT_FOUND);
            }
            else {
                return new ResponseEntity<>(res, HttpStatus.BAD_REQUEST);
            }
        } else {
            Map<String, String> res = new HashMap<>();
            res.put("result", BAD_REQ);
            return new ResponseEntity<>(res, HttpStatus.BAD_REQUEST);
        }
    }


}
