package com.example.goldencrow.editors;

import org.springframework.stereotype.Service;

import java.io.*;
import java.util.HashMap;
import java.util.LinkedList;

@Service
public class EditorsService {
    String path = System.getProperty("user.dir");

    public HashMap<String, String> Formatting(String language, String code) {
        if (language.equals("python")) {
            try {
//                System.out.println(path);
                // temp.py 파일 생성
                File file = new File(path + "\\temp.py");
                FileOutputStream fw = new FileOutputStream(file);
                PrintWriter writer = new PrintWriter(fw);
                // temp.py에 code를 입력
                writer.print(code);

                // FileWriter 닫기(안 하면 오류)
                writer.flush();
                writer.close();

                // windows cmd를 가리키는 변수
                // 나중에 Ubuntu할 때 맞는 변수로 바꿀 것
                String env = "cmd /c ";
                String command = "black " + path + "\\temp.py";
//                System.out.println(env + command);

                // Black 작동 => 성공
                Runtime.getRuntime().exec(env + command);

                String result = readFile();

                HashMap<String, String> goodReturn = new HashMap<>();
                goodReturn.put("data", result);
                return goodReturn;
            } catch (Exception e) {
                HashMap<String, String> failReturn = new HashMap<>();
                failReturn.put("data", null);
                e.printStackTrace();
                return failReturn;
            }
        } else {
            return null;
        }
    }

    public HashMap<String , String > Linting(String language, String code) {
        if (language.equals("python")){
            System.out.println(code);
            HashMap<String, String> goodReturn = new HashMap<>();
            goodReturn.put("data", "통신성공");
            return goodReturn;
        } else {
            return null;
        }
    }

    public String readFile() throws IOException {
        BufferedReader reader = new BufferedReader(new FileReader(path + "\\temp.py"));

        String str;
        StringBuilder text = new StringBuilder();
        while ((str = reader.readLine()) != null){
            System.out.println(str);
            text.append(str);
        }

        File file = new File(path + "\\temp.py");
        if (file.exists()) {
            if (file.delete()) {
                System.out.println("Delete Success");
            }
        }

        return text.toString();
    }

    public HashMap<String, Object> autoComplete(String text){
        LinkedList<String > response = new LinkedList<>();
        response.add(text);
        response.add("통신");
        response.add("일단");
        response.add("성공");
        HashMap<String, Object> result = new HashMap<>();
        result.put("data", response);
        return result;
    }
}
