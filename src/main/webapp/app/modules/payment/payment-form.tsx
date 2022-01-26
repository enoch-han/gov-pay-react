/* eslint-disable no-console */
import './payment.scss';

import React, { useEffect, useState } from 'react';
import { Link, RouteComponentProps } from 'react-router-dom';
import { isEmail, ValidatedField, ValidatedForm } from 'react-jhipster';
import { Row, Col, Alert, Form, Button } from 'reactstrap';

import { AppThunk, useAppDispatch, useAppSelector } from 'app/config/store';
import { useForm } from 'react-hook-form';
import { Payment } from './payment.model';
import { aquireCompanyName, aquireLastPayment, getCompanyNameAndLastPayment, savePayment } from './payment.reducer';
import { Mockbin } from './mockbin.model';

export const PaymentForm = (props: RouteComponentProps<any>) => {

    const dispatch = useAppDispatch();
    const currentPayment = useAppSelector(state => state.payment.currentPayment);
    const currentCompanyName = useAppSelector(state => state.payment.companyName);
    const currentLastPayment = useAppSelector(state => state.payment.lastPayment);
    const [localCurrentPayment, setLocalCurrentPayment] = useState(currentPayment);


    // const [cikValue, setCikValue] = useState(1234658);
    // const [cccValue, setCccValue] = useState('adfdaf');
    // const [paymentAmountValue, setPaymentAmountValue] = useState(15);
    // const [nameValue, setNameValue] = useState('hen');
    // const [emailValue, setEmailValue] = useState('hen@gmail.com');
    // const [phoneValue, setPhoneValue] = useState('1234567898');

    useEffect(() => {
        if (localStorage.getItem('payment') !== null) {
            const sessionValue = JSON.parse(localStorage.getItem('payment')) as Payment;
            if (sessionValue instanceof Payment) {
                dispatch(savePayment(sessionValue));
                setLocalCurrentPayment(sessionValue);
            }
        }
    }, []);

    useEffect(() => {
        console.log("############## current local value #################");
        console.log(localCurrentPayment)
    }, [localCurrentPayment])

    const submitForm = (data) => {
        // eslint-disable-next-line no-console
        console.log(data);
        const payment = new Payment(
            data.cik,
            data.ccc,
            data.paymentAmount,
            data.name,
            data.email,
            data.phoneNumber);
        // eslint-disable-next-line no-console
        console.log(payment);
        dispatch(savePayment(payment));
        dispatch(aquireCompanyName()).then((value: any) => {
            dispatch(aquireLastPayment()).then(() => {
                setLocalCurrentPayment(payment);
                props.history.push('/payment-review');
            })
        })
    }

    const handleClear = () => {
        const copy = null as Payment;
        dispatch(savePayment(copy));
        localStorage.removeItem('payment');
        setLocalCurrentPayment(null);
        props.history.push('/');
    }

    return (
        <div>
            <div className="top">
                <div>
                    <h4>US securities and exchange comission</h4>
                </div>
                <div style={{ float: 'right', width: '40%' }}>
                </div>
            </div>
            <div className="middle">
                <div className="info">
                    <h2>
                        <b style={{ color: '#00134d' }}> Submit payment </b>
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
                <div style={{ backgroundColor: '#e6e6e6' }}>
                    <div className="title">
                        <h3>
                            <p>
                                <b> Enter the information </b>
                            </p>
                        </h3>
                    </div>
                    <div style={{ padding: '20px' }} key={localCurrentPayment?.ccc}>
                        <ValidatedForm id="paymentForm" onSubmit={submitForm}>
                            <h5>
                                <b>Your credential and payment amount</b>
                            </h5>
                            <ValidatedField
                                name="cik"
                                label="CIK"
                                defaultValue={localCurrentPayment?.cik}
                                placeholder="CIK ..."
                                type="number"
                                autoFocus
                                data-cy="cik"
                                validate={{
                                    required: { value: true, message: 'Your cik is required' },
                                    pattern: { value: /^[0-9]*$/, message: 'Cik should only be numeral' },
                                    maxLength: { value: 10, message: 'cik should not be greater than 10 digits' },
                                    minLength: { value: 7, message: 'cik should not be less thatn 7 digits' }
                                }}
                            />
                            <ValidatedField
                                name="ccc"
                                label="CCC"
                                defaultValue={localCurrentPayment?.ccc}
                                placeholder="CCC ..."
                                type="text"
                                required
                                data-cy="ccc"
                                validate={{
                                    required: { value: true, message: 'Your ccc id required' },
                                    pattern: { value: /^[a-zA-Z0-9_]*$/, message: 'ccc should be alphanumeric value' }
                                }}
                            />
                            <ValidatedField
                                name="paymentAmount"
                                label="Payment Amount"
                                defaultValue={localCurrentPayment?.paymentAmount}
                                placeholder="Amount ..."
                                type="number"
                                required
                                data-cy="paymentAmount"
                                validate={{
                                    required: { value: true, message: 'Payment amount is required' },
                                    min: { value: 5, message: 'The minimum payment amount is 5' }
                                }}
                            />
                            <h5>
                                <b>Your contact information</b>
                            </h5>
                            <ValidatedField
                                name="name"
                                label="Name"
                                defaultValue={localCurrentPayment?.name}
                                placeholder="Name ..."
                                type="text"
                                required
                                data-cy="name"
                                validate={{
                                    required: { value: true, message: 'Name is required' }
                                }}
                            />
                            <ValidatedField
                                name="email"
                                defaultValue={localCurrentPayment?.email}
                                label="Email"
                                placeholder="Email ..."
                                type="email"
                                data-cy="email"
                                validate={{
                                    required: { value: true, message: 'Email is required' },
                                    validate: v => isEmail(v) || 'enter a valid email'
                                }}
                            />
                            <ValidatedField
                                name="phoneNumber"
                                label="Phone"
                                defaultValue={localCurrentPayment?.phoneNumber}
                                placeholder="Phone Number ..."
                                type="text"
                                required
                                data-cy="phoneNumber"
                                validate={{
                                    required: { value: true, message: 'Phone number is required' },
                                    pattern: { value: /^[0-9]*$/, message: 'phone should only be numbers' },
                                    minLength: { value: 10, message: 'minumum phone number length is 10' },
                                    maxLength: { value: 10, message: 'maximum phone number length is 10' }
                                }}
                            />
                            <Row>
                                <Button color='secondary' style={{ margin: '10px' }} onClick={handleClear}>Clear</Button>
                                <Button color='primary' style={{ margin: '10px' }} type='submit' data-cy="submit">Next</Button>
                            </Row>
                        </ValidatedForm>
                    </div >
                </div >
            </div >
        </div >

    );

}

export default PaymentForm;