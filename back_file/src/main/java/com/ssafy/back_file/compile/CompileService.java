package com.ssafy.back_file.compile;

//import com.ssafy.back_file.File.FileDto.FileCreateDto;
//import com.ssafy.back_file.File.Service.FileService;
import org.springframework.stereotype.Service;

import java.io.BufferedReader;
import java.io.File;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.Date;
import java.util.Map;
import java.util.Objects;

@Service
public class CompileService {

//    private FileService fileService;

    // 포트 할당 로직
    public void port(String filePath, String type) {

    }

    // 도커파일 생성
//    public boolean dockerfile(String filePath, String type, Long teamSeq) {
//        if (Objects.equals(type, "pure")) {
//            int filePathIndex = filePath.lastIndexOf("/");
//            String dockerfilePath = filePath.substring(0, filePathIndex) + "\\Dockerfile";
////            FileCreateDto fileCreateDto = new FileCreateDto();
////            fileCreateDto.setFilePath(filepath);
////            fileCreateDto.setFileTitle("Dockerfile");
//            String content = "FROM python:3.10\n" +
//                    "\n" +
//                    "RUN python3" + filePath;
//            return fileService.saveFile(dockerfilePath, content);
//        }
//        else if (Objects.equals(type, "Django")) {
//
//        }
//    }


    public String pyCompile(Map<String, String> req) {
        if (Objects.equals(req.get("type"), "pure")) {
            String command = "python3 " + req.get("filePath");
            String result = "";
            Runtime rt = Runtime.getRuntime();
            Process p = null;
            StringBuffer sb = new StringBuffer();
            try{
                p=rt.exec(command);
                BufferedReader in = new BufferedReader(new InputStreamReader(p.getInputStream()));
                String cl = null;
                while((cl=in.readLine())!=null){
                    sb.append(cl);
                }
                result = sb.toString();
                in.close();
            }catch(IOException e){
                e.printStackTrace();
                return "";
            }
            return result;
        }
        else {
            return "no pure";
        }


//        try {
//            String cmd = String.format("python %s", req.get("filePath"));
//            Process p = Runtime.getRuntime().exec("cmd /c " + cmd);
//
//            BufferedReader r = new BufferedReader(new InputStreamReader(p.getInputStream()));
//            String l = null;
//            StringBuffer sb = new StringBuffer();
//            while ((l = r.readLine()) != null) {
//                sb.append(l);
//                sb.append("\n");
//            }
//            return sb.toString();
//        } catch (Exception e) {
//            e.printStackTrace();
//        }
//        return null;
//    }
    }
}
