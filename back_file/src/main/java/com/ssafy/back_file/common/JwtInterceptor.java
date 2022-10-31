package com.ssafy.back_file.common;

import com.ssafy.back_file.user.JwtService;
import org.springframework.http.HttpMethod;
import org.springframework.web.servlet.HandlerInterceptor;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

public class JwtInterceptor implements HandlerInterceptor {

    @Resource
    private JwtService jwtService;

    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler){

        if(HttpMethod.OPTIONS.matches(request.getMethod())){
            return true;
        }

        String jwt = request.getHeader("jwt");
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
