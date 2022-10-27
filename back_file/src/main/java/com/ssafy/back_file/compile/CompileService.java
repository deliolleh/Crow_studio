package com.ssafy.back_file.compile;

import org.springframework.stereotype.Service;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.Map;

@Service
public class CompileService {

    public String pyCompile(Map<String, Object> req) {

        try {
            String cmd = String.format("python %s", req.get("filePath"));
            Process p = Runtime.getRuntime().exec("cmd /c " + cmd);

            BufferedReader r = new BufferedReader(new InputStreamReader(p.getInputStream()));
            String l = null;
            StringBuffer sb = new StringBuffer();
//            sb.append(cmd);
//            sb.append("\n");
            while ((l = r.readLine()) != null) {
                sb.append(l);
                sb.append("\n");
            }
            return sb.toString();
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }
}
