package com.example.goldencrow.config;

import com.example.goldencrow.common.JwtInterceptor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;


@Configuration
public class WebMvcConfig implements WebMvcConfigurer {

    @Autowired
    JwtInterceptor jwtInterceptor;

    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(jwtInterceptor)
                .addPathPatterns("/**")
                .excludePathPatterns("/api/users/signup")
                .excludePathPatterns("/api/users/login")
                .excludePathPatterns("/api/users/mypage/**")
                .excludePathPatterns("/api/users/search/**")
                .excludePathPatterns("/api/forum/read")
                .excludePathPatterns("/api/forum/read/**");

        // 토큰 필요없는 거 여기에 차차 다 추가하기
    }

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                .allowedOriginPatterns("*")
                .allowedHeaders("*")
                .exposedHeaders("*")
                .allowCredentials(true)
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .maxAge(6000);
    }

//    @Bean
//    protected JwtInterceptor jwtInterceptor() {
//        return new JwtInterceptor();
//    }


}
