/* eslint-disable no-console */
import './payment.scss';
import React, { useEffect, useState } from 'react';
import { Link, RouteComponentProps } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import { Row, Col, Alert, Form, Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { aquirePayment, initiatePayment, savePayment } from './payment.reducer';
import { Payment } from './payment.model';


export const PaymentReview = (props: RouteComponentProps<any>) => {

    const dispatch = useAppDispatch();
    const currentPayment = useAppSelector(state => state.payment.currentPayment);
    const [redirectUrl, setRedirectUrl] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [countDownValue, setCountDownValue] = useState(0);
    const [canCancel, setCanCancel] = useState(false);
    const [canContinue, setCanContinue] = useState(true);
    const [intervalId, setIntervalId] = useState(0);
    // eslint-disable-next-line no-var
    var some = 0;
    const handleProccedToPayment = () => {
        dispatch(initiatePayment(currentPayment)).then((value: any) => {
            setRedirectUrl("https://payment.".concat(value.payload.data.partialRedirectUrl))
            console.log(value);
            setShowModal(true);
            setCanContinue(true);
            setIntervalId(() => {
                return startCountDown();
            });
        }).catch(err => console.log(err))
    }
    const handleClose = () => {
        clearInterval(intervalId);
        setCanContinue(true);
        setShowModal(false);
    }
    const handleContinue = () => {
        console.log(JSON.stringify(currentPayment));
        console.log("setting session value");
        setShowModal(false)
        clearInterval(intervalId);
        setCountDownValue(0);
        setCanContinue(true);
        goToUrl();
    }
    const goToUrl = () => {
        localStorage.setItem('payment', JSON.stringify(currentPayment));
        window.location.href = redirectUrl;
    }

    const startCountDown = () => {
        const intervalCount = setInterval(() => {
            setCountDownValue((Value) => Value + 1);
        }, 1000);
        return intervalCount;
    }
    const checkCountDown = () => {
        if (countDownValue === 10) {
            clearInterval(intervalId);
            setCountDownValue(0);
            setShowModal(false);
            if (canContinue) {
                goToUrl();
            }
        }
    }
    useEffect(() => {
        const query = new URLSearchParams(props.location.search);
        const hostedIdParam = query.get('hostedCheckoutId');
        console.log(hostedIdParam);
        if (hostedIdParam !== null) {
            const sessionValue = JSON.parse(localStorage.getItem('payment')) as Payment;

            dispatch(aquirePayment(hostedIdParam.toString())).then((value: any) => {
                sessionValue.paymentId = value.payload.data.createdPaymentOutput.payment.id;
                dispatch(savePayment(sessionValue));
                // value.payload.data.createdPaymentOutput.payment.id
                props.history.push('/payment-confirmation');
            }).catch(err => console.log(err));
        }
    }, [])

    useEffect(() => {
        console.log("&&&&&&&&&&&&&&&&&&& rerendering &&&&&&&&&&")
        console.log(countDownValue);
        checkCountDown();
    }, [
        countDownValue,
        currentPayment,
        showModal,
        intervalId,
        canContinue,
        canCancel,
    ])

    return (
        <div>
            <div className="top">
                <div>
                    <h4>Exchange Comission</h4>
                </div>
                <div style={{ float: "right", width: "40%" }}>
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
                <div style={{ backgroundColor: "#e6e6e6" }}>
                    <div className="title">
                        <h3>
                            <p>
                                <b> Confrim information </b>
                            </p>
                        </h3>
                    </div>
                    <div style={{ textAlign: "center" }}>
                        <p><i>please review the information below then click proceed to payment. Return to the previous screen by clicking Back</i></p>
                    </div>
                    <div style={{ padding: "20px" }}>
                        <h4>
                            <b>Your credential and payment amount</b>
                        </h4>

                        <p style={{ fontWeight: "bold" }}><b>CIK</b></p>
                        <p>{currentPayment?.cik}</p>

                        <p style={{ fontWeight: "bold" }}><b>CCC</b></p>
                        <p>{currentPayment?.ccc}</p>

                        <p style={{ fontWeight: "bold" }}><b>Company Name</b></p>
                        <p>{currentPayment?.companyName}</p>

                        <p style={{ fontWeight: "bold" }}><b>Date of last payment</b></p>
                        <p>{currentPayment?.lastPayment}</p>

                        <p style={{ fontWeight: "bold" }}><b>Payment Amount</b></p>
                        <p>{currentPayment?.paymentAmount}</p>

                        <h4>
                            <b>Your contact information</b>
                        </h4>

                        <p style={{ fontWeight: "bold" }}><b>Name</b></p>
                        <p>{currentPayment?.name}</p>

                        <p style={{ fontWeight: "bold" }}><b>Email</b></p>
                        <p>{currentPayment?.email}</p>

                        <p style={{ fontWeight: "bold" }}><b>Phone</b></p>
                        <p>{currentPayment?.phoneNumber}</p>
                        <Row>
                            <Button color='secondary' style={{ margin: '10px' }}>Back</Button>
                            <Button color='primary' style={{ margin: '10px' }} onClick={handleProccedToPayment}>Procced to Payment</Button>
                        </Row>
                    </div>
                </div>
            </div>
            <Modal isOpen={showModal} toggle={handleClose}>
                <ModalHeader
                    charCode="X"
                    toggle={handleClose}
                >
                    <b>Redirecting your to payment site ...</b>
                </ModalHeader>
                <ModalBody>
                    <p>{redirectUrl}</p>
                    <b>{countDownValue}</b>
                </ModalBody>
                <ModalFooter>
                    <Button
                        color="primary"
                        onClick={handleContinue}
                    >
                        Continue
                    </Button>
                    {' '}
                    <Button onClick={handleClose}>
                        Cancel
                    </Button>
                </ModalFooter>
            </Modal>
        </div >

    );
}


