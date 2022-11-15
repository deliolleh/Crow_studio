package com.example.goldencrow.common;

import com.example.goldencrow.user.service.JwtService;
import org.springframework.http.HttpMethod;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

@Component
public class JwtInterceptor implements HandlerInterceptor {

    @Resource
    private JwtService jwtService;

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler){

        if(HttpMethod.OPTIONS.matches(request.getMethod())){
            return true;
        }

        String jwt = request.getHeader("Authorization");
        System.out.println("Interceptor Called");

        try {

            if(jwt!=null && this.jwtService.verifyJWT(jwt).get("result").equals("success")) {
                System.out.println("Interceptor Passed");
                return true;
            } else {
                System.out.println("Invalid Request");
                response.setStatus(401);
                return false;
            }
        } catch (Exception e) {
            throw new RuntimeException(e);
        }

    }


}
