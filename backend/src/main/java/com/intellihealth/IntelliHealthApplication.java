package com.intellihealth;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class IntelliHealthApplication {
    public static void main(String[] args) {
        SpringApplication.run(IntelliHealthApplication.class, args);
    }
}
