package com.company.govpayreact.service;

import com.company.govpayreact.domain.Payment;
import com.company.govpayreact.repository.PaymentRepository;
import java.util.List;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class PaymentService {

    private final Logger log = LoggerFactory.getLogger(PaymentService.class);

    private final PaymentRepository paymentRepository;

    public PaymentService(PaymentRepository paymentRepository) {
        this.paymentRepository = paymentRepository;
    }

    public Payment save(Payment payment) {
        log.debug("Request to save payment : {}", payment);
        return paymentRepository.save(payment);
    }
    //
}
