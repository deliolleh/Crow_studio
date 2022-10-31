package com.ssafy.back_file.config;

import com.ssafy.back_file.common.JwtInterceptor;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebMvcConfig implements WebMvcConfigurer {

    @Override
    public void addInterceptors(InterceptorRegistry registry){
        registry.addInterceptor(this.jwtInterceptor())
                .addPathPatterns("/**");
//                .excludePathPatterns("/api/users/signup")
//                .excludePathPatterns("/api/users/login")
//                .excludePathPatterns("/api/users/mypage/**")
//                .excludePathPatterns("/api/forum/read")
//                .excludePathPatterns("/api/forum/read/**");

        // 토큰 필요없는 거 여기에 차차 다 추가하기
    }

    @Override
    public void addCorsMappings(CorsRegistry registry){
        registry.addMapping("/**")
                .allowedOriginPatterns("*")
                .allowedHeaders("*")
                .exposedHeaders("*")
                .allowCredentials(true)
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .maxAge(6000);
    }

    private JwtInterceptor jwtInterceptor() {
        return new JwtInterceptor();
    }


}
