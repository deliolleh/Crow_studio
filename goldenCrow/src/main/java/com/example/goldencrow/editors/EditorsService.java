package com.example.goldencrow.editors;

import org.springframework.stereotype.Service;

import java.io.*;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.*;

@Service
public class EditorsService {
    String path = System.getProperty("user.dir");

    boolean checkOs = System.getProperty("os.name").toLowerCase().contains("window");

    public HashMap<String, String> Formatting(String language, String code) {
        long now = new Date().getTime();
        HashMap<String, String> response = new HashMap<>();

        String type;
        if (language.equals("python")) {
            type = ".py";
        } else {
            type = ".txt";
        }

        try {

            String name = "format" + now + type;
            // temp.py 파일 생성
            File file = new File(path + "\\" + name);
            FileOutputStream ffw = new FileOutputStream(file);
            PrintWriter writer = new PrintWriter(ffw);
            // temp.py에 code를 입력
            writer.print(code);

            // FileWriter 닫기(안 하면 오류)
            writer.flush();
            writer.close();

            // windows cmd를 가리키는 변수
            // 나중에 Ubuntu할 때 맞는 변수로 바꿀 것
            String env;
            System.out.println(checkOs);
            if (checkOs) {
                env = "cmd /c";
            } else {
                env = "/bin/sh -c";
            }
            String command = env + " black " + name;

            // Black 작동 => 성공
            Process p = Runtime.getRuntime().exec(command);
            StringBuilder sb = new StringBuilder();
            BufferedReader br = new BufferedReader(new InputStreamReader(p.getInputStream()));
            String line;
            while((line = br.readLine()) != null) {
                sb.append(line);
            }
            System.out.println(sb);

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

        String name = path + "\\format" + fileName + type;


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
        } catch (Exception e) {
            e.printStackTrace();
        }

        return response;
    }

    public HashMap<String, Object> Linting(String language, String code) {
        HashMap<String, Object> result = new HashMap<>();
        if (language.equals("python")) {
            try {
                File file = new File(path + "\\lint.py");
                FileOutputStream lfw = new FileOutputStream(file);
                PrintWriter writer = new PrintWriter(lfw);
                // temp.py에 code를 입력
                writer.print(code);

                // FileWriter 닫기(안 하면 오류)
                writer.flush();
                writer.close();

                // windows cmd를 가리키는 변수
                // 나중에 Ubuntu할 때 맞는 변수로 바꿀 것
                String env;
                if (checkOs) {
                    env = "cmd /c";
                } else {
                    env = "/bin/sh -c";
                }
                String filePath = path + "\\lint.py";
                String command = "pylint " + filePath;

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

                result.put("data", response);
                result.put("index", index);
                reader.close();

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
