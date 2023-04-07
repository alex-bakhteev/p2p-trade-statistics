import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';

import { registerValidation, loginValidation, postCreateValidation } from './validations.js';
import { checkAuth, handleValidationErrors } from './utils/index.js';
import { UserController, OrderController, RecievedController, PurchaseController, PaymentController } from './controllers/index.js';

mongoose
    .connect('mongoDB-server')
    .then(() => console.log('DB OK'))
    .catch((err) => console.log('DB error', err));

const app = express();

app.use(express.json());

app.use(cors());

// User

app.post('/auth/login', /*loginValidation, handleValidationErrors,*/ UserController.login)

app.post('/auth/register', registerValidation, handleValidationErrors, UserController.register);

app.post('/auth/me', UserController.getMe);

app.post('/auth/fee', UserController.updateFee);

app.post('/auth/token', UserController.updateToken);

app.post('/auth/purchase', UserController.updatePurchase);

// Order

app.post('/orders/get', OrderController.getAll);

app.post('/orders/update', OrderController.updateAll);

app.post('/push', OrderController.create);

// Recieved

app.post('/deals/create', RecievedController.create);

app.post('/deals/update', RecievedController.updateAll);

app.post('/deals/get', RecievedController.getAll);

app.post('/sort', RecievedController.getSortDate);

app.post('/deals/one', RecievedController.getOne);

// Purchase

app.get('/purchase', PurchaseController.checkSortDate);

app.post('/purchase', PurchaseController.create);

app.post('/purchase/all', PurchaseController.updateAll);

app.post('/purchase/:id', PurchaseController.getPurchase);

app.patch('/purchase/update', PurchaseController.updateCurrentPurchase);

// Payment

app.post('/payment/create', PaymentController.create);

app.post('/payment/update', PaymentController.updateAll);

app.post('/payment/sort', PaymentController.getSortDate);

app.listen(4444, (err) => {
    if (err) {
        return console.log(err);
    }
    else {
        console.log('OK');
    }
});