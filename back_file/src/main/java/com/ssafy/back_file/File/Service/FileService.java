package com.ssafy.back_file.File.Service;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.io.File;
import java.io.IOException;

@Service
public class FileService {
    /** 파일 생성 로직
     * 파일이 성공적으로 생성되면 true
     * 아니면 false 반환*/
    public boolean createFile(String fileName, String filePath) {
        String newFilePath = filePath + "\\" + fileName;
        File newFile = new File(newFilePath);
        System.out.println("HERE!!!");
        try{
            if(newFile.createNewFile()) {
                return true;
            } else {
                return false;
            }
        } catch (IOException e) {
            return false;
        }
    }

}
