package com.example.academy.service;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import java.net.URI;
import java.util.*;

@Service
@RequiredArgsConstructor
public class BusinessService {

    private final RestTemplate restTemplate;

    @Value("${api.biz.serviceKey}")
    private String serviceKey;

    public String verify(String businessNumber) {
        System.out.println("▶ 인증 시작. 사업자번호: " + businessNumber);
        System.out.println("▶ 서비스키 (인코딩된 값): " + serviceKey);

        try {
            URI uri = UriComponentsBuilder.fromHttpUrl("https://api.odcloud.kr/api/nts-businessman/v1/status")
                    .queryParam("serviceKey", serviceKey)
                    .build(true)
                    .toUri();

            Map<String, Object> body = new HashMap<>();
            body.put("b_no", Collections.singletonList(businessNumber));

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.setAccept(Collections.singletonList(MediaType.APPLICATION_JSON));

            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(body, headers);

            ResponseEntity<Map> response = restTemplate.postForEntity(uri, entity, Map.class);

            System.out.println("응답 상태: " + response.getStatusCode());
            System.out.println("응답 본문: " + response.getBody());

            if (response.getStatusCode() == HttpStatus.OK && response.getBody() != null) {
                List<Map<String, Object>> data = (List<Map<String, Object>>) response.getBody().get("data");

                if (data != null && !data.isEmpty()) {
                    Map<String, Object> first = data.get(0);
                    String status = (String) first.get("b_stt");
                    String endDt = (String) first.get("end_dt");

                    if ("계속사업자".equals(status) && (endDt == null || endDt.isBlank())) {
                        return "✅ 유효한 사업자입니다";
                    } else {
                        return "❌ 휴업/폐업된 사업자입니다";
                    }
                }
            }

            return "❌ 사업자 데이터가 존재하지 않습니다.";
        } catch (Exception e) {
            return "❌ 오류 발생: " + e.getMessage();
        }
    }
}
