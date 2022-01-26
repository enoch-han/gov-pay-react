/* eslint-disable no-console */
import { Mockbin } from './mockbin.model';
import axios from 'axios';
import { createAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { serializeAxiosError } from 'app/shared/reducers/reducer.utils';
import { Payment } from './payment.model';
import { Wpayment } from './wpayment.model';
import { WPaymentSuccessResponse } from './wpayment-success-response.model';
import { AppThunk } from 'app/config/store';

export const initialState = {
    loading: false,
    paymentSuccess: false,
    paymentFailure: false,
    errorMessage: null as unknown as string,
    successMessage: null as unknown as string,
    currentPayment: null as Payment,
    companyName: '',
    lastPayment: '',
    redirectUrl: '',
    hostedCheckoutId: ''
};

export type PaymentState = Readonly<typeof initialState>;

// function which requests company name and last payment form server
export const getCompanyNameAndLastPayment = (): AppThunk => (dispatch, getState) => {
    dispatch(aquireCompanyName());
    dispatch(aquireLastPayment());
}

// creates payment in the database 
export const createPayment = createAsyncThunk(
    'payment/createPayment',
    async (payment: Payment) => axios.post<Payment>("/api/payments", payment),
    { serializeError: serializeAxiosError }
);

// export const savePaymentAction = createAction<Payment>('payment/save_payment'); 

export const aquirePayment = createAsyncThunk(
    'payment/aquirePayment',
    async (CheckoutId: string) => axios.post<Wpayment>("/api/payments/getPaymentResponse", CheckoutId),
    { serializeError: serializeAxiosError }
);

export const aquireCompanyName = createAsyncThunk(
    'payment/aquireCompanyName',
    async () => axios.get<Mockbin>("/api/payments/companyName/"),
    { serializeError: serializeAxiosError }
);

export const aquireLastPayment = createAsyncThunk(
    'payment/aquireLastPayment',
    async () => axios.get<Mockbin>("/api/payments/lastPayment/"),
    { serializeError: serializeAxiosError }
);

export const initiatePayment = createAsyncThunk(
    'payment/initiatePayment',
    async (payment: Payment) => axios.post<WPaymentSuccessResponse>("/api/payments/initiate", payment),
    { serializeError: serializeAxiosError }
);

export const PaymentSlice = createSlice({
    name: 'payment',
    initialState: initialState as PaymentState,
    reducers: {
        savePayment(state, action) {
            // saves the current payment value 
            const currentPayment = action.payload
            // state.currentPayment = currentPayment;
            return {
                ...state,
                currentPayment,
            }

        }
    },
    extraReducers(builder) {
        builder
            .addCase(createPayment.rejected, (state, action) => ({
                ...state,
                errorMessage: action.error.message,
                paymentFailure: true,
                paymentSuccess: false
            }))
            .addCase(createPayment.pending, state => {
                state.loading = true;
            })
            .addCase(createPayment.fulfilled, (state, action) => {
                const currentPayment = action.payload && action.payload.data
                return {
                    ...state,
                    currentPayment,
                    loading: false,
                    paymentSuccess: true,
                };
            })
            .addCase(aquireCompanyName.rejected, (state, action) => ({
                ...state,
                errorMessage: action.error.message
            }))
            .addCase(aquireCompanyName.pending, state => {
                state.loading = true;
            })
            .addCase(aquireCompanyName.fulfilled, (state, action) => {
                const companyName = action.payload.data.text
                if (state.currentPayment != null) {
                    state.currentPayment.companyName = companyName;
                }
                console.log(action.payload);
                return {
                    ...state,
                    companyName,
                    loading: false,
                }
            })
            .addCase(aquireLastPayment.rejected, (state, action) => ({
                ...state,
                errorMessage: action.error.message
            }))
            .addCase(aquireLastPayment.pending, state => {
                state.loading = true;
            })
            .addCase(aquireLastPayment.fulfilled, (state, action) => {
                const lastPayment = action.payload.data.text;
                if (state.currentPayment != null) {
                    state.currentPayment.lastPayment = +lastPayment;
                }
                console.log(action.payload);
                return {
                    ...state,
                    lastPayment,
                    loading: false,
                }
            })
            .addCase(initiatePayment.rejected, (state, action) => ({
                ...state,
                errorMessage: action.error.message,
            }))
            .addCase(initiatePayment.pending, state => {
                state.loading = true;
            })
            .addCase(initiatePayment.fulfilled, (state, action) => {
                const partialUrl = action.payload.data.partialRedirectUrl;
                const redirectUrl = 'https://payment.'.concat(partialUrl);
                const hostedCheckoutId = action.payload.data.hostedCheckoutId;
                return {
                    ...state,
                    loading: false,
                    redirectUrl,
                    hostedCheckoutId,
                }
            })
            .addCase(aquirePayment.rejected, (state, action) => ({
                ...state,
                errorMessage: action.error.message,
            }))
            .addCase(aquirePayment.pending, state => {
                state.loading = true;
            })
            .addCase(aquirePayment.fulfilled, (state, action) => {
                // const copy = state.currentPayment
                // if (state.currentPayment != null) {
                //     state.currentPayment.paymentId = action.payload.data.createdPaymentOutput.payment.id;
                // }
                return {
                    ...state,
                    loading: false,
                }
            })
    }
});

export const { savePayment } = PaymentSlice.actions

export default PaymentSlice.reducer;