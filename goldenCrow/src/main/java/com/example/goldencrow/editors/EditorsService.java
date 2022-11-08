package com.example.goldencrow.editors;

import org.springframework.stereotype.Service;

import java.io.*;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.LinkedList;

@Service
public class EditorsService {

    boolean checkOs = System.getProperty("os.name").toLowerCase().contains("window");
    String path = checkOs ? System.getProperty("user.dir") + "\\" : "/home/ubuntu/crow_data/temp/";

    public HashMap<String, String> Formatting(String language, String code) {
        System.out.println("Format Service in");
        long now = new Date().getTime();
        HashMap<String, String> response = new HashMap<>();
        System.out.println(path);

        String type;
        if (language.equals("python")) {
            type = ".py";
        } else {
            type = ".txt";
        }

        try {

            String name = "format" + now + type;
            // temp.py 파일 생성
            File file = new File(path + name);
            System.out.println("파일생성 성공");
            FileOutputStream ffw = new FileOutputStream(file);
            PrintWriter writer = new PrintWriter(ffw);
            // temp.py에 code를 입력
            writer.print(code);

            // FileWriter 닫기(안 하면 오류)
            writer.flush();
            writer.close();

            // windows cmd를 가리키는 변수
            // 나중에 Ubuntu할 때 맞는 변수로 바꿀 것
            String env = checkOs ? "cmd /c" : "";
            System.out.println(checkOs ? "Operating in windows" : "Operating in linux");
            String command = env + " black " + path + name;
            System.out.println(command);

            // Black 작동 => 성공
            Process p = Runtime.getRuntime().exec(command);
            p.waitFor();

            response.put("data", now + "");

        } catch (Exception e) {

            response.put("data", "null");
            System.out.println("문제 발생");
            e.printStackTrace();

        }
        return response;

    }

    public HashMap<String, String> FormatRead(String language, String fileName) {

        HashMap<String, String> response = new HashMap<>();
        String type;

        if (language.equals("python")) {
            type = ".py";
        } else {
            type = ".txt";
        }

        String name = path + "format" + fileName + type;


        try {
            BufferedReader reader = new BufferedReader(new FileReader(name));
            StringBuilder sb = new StringBuilder();
            String str;
            while ((str = reader.readLine()) != null) {
//                System.out.println(str);
                sb.append(str);
            }

            response.put("data", sb.toString());
            reader.close();


        } catch (Exception e) {
            e.printStackTrace();
            response.put("data", "null");
        }

        Path filePath = Paths.get(name);
        try {
            Files.deleteIfExists(filePath);
            System.out.println("Delete file complete");
        } catch (Exception e) {
            System.out.println("Deleting file fail");
            e.printStackTrace();
        }

        return response;
    }

    public HashMap<String, Object> Linting(String language, String code) {
        HashMap<String, Object> result = new HashMap<>();
        if (language.equals("python")) {
            try {
                File file = new File(path + "lint.py");
                System.out.println("lint.py 생성");
                FileOutputStream lfw = new FileOutputStream(file);
                PrintWriter writer = new PrintWriter(lfw);
                // temp.py에 code를 입력
                writer.print(code);

                // FileWriter 닫기(안 하면 오류)
                writer.flush();
                writer.close();

                // windows cmd를 가리키는 변수
                // 나중에 Ubuntu할 때 맞는 변수로 바꿀 것
                String env = checkOs ? "cmd /c" : "";
                String filePath = path + "lint.py";
                String command = "pylint " + filePath;
                System.out.println(command);

                Process process = Runtime.getRuntime().exec(env + command);
                BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream()));
                String line;

                LinkedList<String> response = new LinkedList<>();
                ArrayList<Integer> index = new ArrayList<>();
                while ((line = reader.readLine()) != null) {
                    System.out.println(line);
                    if (line.contains("lint.py")) {
                        String[] letters = line.split(":");
                        int number = Integer.parseInt(letters[1]);
                        index.add(number);
                        response.add(letters[4].trim());
                    }
                }

                reader.close();
                result.put("data", response);
                result.put("index", index);

                try {
                    File deleteFile = new File(filePath);
                    if (deleteFile.delete()) {
                        System.out.println("파일이 정상적으로 삭제되었습니다");
                    } else {
                        System.out.println("파일이 삭제되지 않았습니다");
                    }
                } catch (Exception e) {
                    e.printStackTrace();
                }

            } catch (Exception e) {
                e.printStackTrace();
                result.put("data", "null");
            }

        } else {
            return null;
        }
        return result;
    }

    public HashMap<String, Object> autoComplete(String text) {
        LinkedList<String> response = new LinkedList<>();
        response.add(text);
        response.add("통신");
        response.add("일단");
        response.add("성공");
        HashMap<String, Object> result = new HashMap<>();
        result.put("data", response);
        return result;
    }
}
