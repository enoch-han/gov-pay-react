package com.company.govpayreact.cucumber;

import com.company.govpayreact.GovpayreactApp;
import io.cucumber.spring.CucumberContextConfiguration;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.web.WebAppConfiguration;

@CucumberContextConfiguration
@SpringBootTest(classes = GovpayreactApp.class)
@WebAppConfiguration
public class CucumberTestContextConfiguration {}
