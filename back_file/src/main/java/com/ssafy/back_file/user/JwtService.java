package com.ssafy.back_file.user;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.UnsupportedEncodingException;
import java.time.Duration;
import java.util.Base64;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@Service
public class JwtService {

    @Value("${secret.jwt.key}")
    private String SECRET_KEY;
    private final Base64.Encoder encoder = Base64.getEncoder();
    private final Base64.Decoder decoder = Base64.getDecoder();

    private long accessTokenValidTime = Duration.ofDays(30).toMillis(); // 만료시간 30일
    private long refreshTokenValidTime = Duration.ofDays(100).toMillis(); // 만료시간 100일

    // 액세스 토큰 만들기
    public String createAccess(Long userSeq){

        // 헤더 설정
        Map<String, Object> headers = new HashMap<>();
        headers.put("typ", "JWT");
        headers.put("alg", "HS256");

        // 페이로드 설정
        Map<String, Object> payloads = new HashMap<>();
        payloads.put("jti", userSeq);

        Date ext = new Date();
        ext.setTime(ext.getTime()+accessTokenValidTime);

        // 토큰 빌드
        String jwt = Jwts.builder()
                .setHeader(headers)
                .setClaims(payloads)
                .setExpiration(ext)
                .signWith(SignatureAlgorithm.HS256, SECRET_KEY.getBytes())
                .compact();

        return jwt;

    }

    // 리프레시 토큰 만들기
    public String createRefresh(Long userSeq){

        // 헤더 설정
        Map<String, Object> headers = new HashMap<>();
        headers.put("typ", "JWT");
        headers.put("alg", "HS256");

        // 페이로드 설정
        Map<String, Object> payloads = new HashMap<>();
        payloads.put("jti", userSeq);

        Date ext = new Date();
        ext.setTime(ext.getTime()+refreshTokenValidTime);

        // 토큰 빌드
        String jwt = Jwts.builder()
                .setHeader(headers)
                .setClaims(payloads)
                .setExpiration(ext)
                .signWith(SignatureAlgorithm.HS256, SECRET_KEY.getBytes())
                .compact();

        return jwt;

    }

    // 이거 우리 토큰 맞는지, 유효기간 남았는지, 파스하면 뭔지 확인하기
    public Map<String, Object> verifyJWT(String jwt) throws Exception {
        Map<String, Object> claimMap = new HashMap<>();

        try {
            Claims claims = Jwts.parser()
                    .setSigningKey(SECRET_KEY.getBytes("UTF-8"))
                    .parseClaimsJws(jwt)
                    .getBody();

            claimMap = claims;
            claimMap.put("result", "success");

        } catch (ExpiredJwtException e) {
            // 토큰이 만료된 경우
            System.out.println(e);
            claimMap.put("result", "expire");

        } catch (Exception e){
            System.out.println(e);
            claimMap.put("result", "error");
        }

        return claimMap;

    }

    // parse 하면 누군지 찾아내기
    public Long JWTtoUserSeq(String jwt) {

        try {
            Claims claims = Jwts.parser()
                    .setSigningKey(SECRET_KEY.getBytes("UTF-8"))
                    .parseClaimsJws(jwt)
                    .getBody();

            Map<String, Object> claimMap = claims;
            Long userSeq = (Long) claimMap.get("userSeq");

            return userSeq;

        } catch (UnsupportedEncodingException e) {
            throw new RuntimeException(e);
        }

    }

    // 리프레시 토큰을 보내주면 그걸로 새로 액세스 토큰을 발급하기
    public String createRefreshByAccess(String jwt)throws UnsupportedEncodingException{
        Map<String, Object> claimMap = new HashMap<>();

        try {
            Claims claims = Jwts.parser()
                    .setSigningKey(SECRET_KEY.getBytes("UTF-8"))
                    .parseClaimsJws(jwt)
                    .getBody();

            // 리프레시 토큰이 만료되었을 것이라는 전제는 없다...

            claimMap = claims;
            Long userSeq = (Long) claimMap.get("jti");

            return createAccess(userSeq);

        } catch (Exception e){
            System.out.println(e);
            return null;
        }

    }

}
