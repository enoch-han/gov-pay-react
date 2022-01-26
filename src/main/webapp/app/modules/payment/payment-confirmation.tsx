import './payment.scss';
import React, { useEffect, useState } from 'react';
import { Link, RouteComponentProps } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import { Row, Col, Alert, Form, Button } from 'reactstrap';
import { useForm } from 'react-hook-form';
import { createPayment } from './payment.reducer';

export const PaymentConfirmation = (props: RouteComponentProps<any>) => {

    const dispatch = useAppDispatch();
    const currentPayment = useAppSelector(state => state.payment.currentPayment);

    useEffect(() => {
        dispatch(createPayment(currentPayment));
    }, [])

    const handleBack = () => {
        props.history.push('/');
    }

    return (
        <div>
            <div className="top">
                <div>
                    <h4>Exchange Comission</h4>
                </div>
            </div>
            <div className="middle">
                <div className="info">
                    <h2>
                        <b style={{ color: "#00134d" }}> Submit payment </b>
                    </h2>
                    <p>
                        To submit an SEC filling fee payment using ACH, credit or debit card, enter the below information and click next you will then
                        verify your CIK and contact information before selecting a payment type and entering your payment information.
                    </p>
                    <p>
                        Please note: ACH payments take 1-3 buisness days before being reflected in EDGAR. credit and debit card transation will appear in
                        EDGAR in [TBD] hours.
                    </p>
                </div>
                <div style={{ backgroundColor: "#e6e6e6", paddingBottom: "50px" }}>
                    <div className="title">
                        <h3>
                            <p>
                                <b> Process Payment </b>
                            </p>
                        </h3>
                    </div>
                    <div className="middlecard">
                        <p style={{ fontWeight: "bold" }}>Processing Payment</p>
                        <hr />
                        <p> The Credit/Debit card payment has been processed.</p>
                        <p>The collection will be visible in EDGAR in the next 15 minutes</p>
                        <br />
                        <p>Transaction ID: {currentPayment?.paymentId}</p>
                        <p>Transation Amount: {currentPayment?.paymentAmount}</p>
                        <br />
                        <p>An email confirmation will be sent to you shortly</p>
                        <Row>
                            <Button color='secondary' style={{ margin: '10px' }} onClick={handleBack}>Back</Button>
                        </Row>
                    </div>
                </div>
            </div>
        </div>
    );
}