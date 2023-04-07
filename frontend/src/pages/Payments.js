import React, { useState } from "react";

export const Payments = (props) => {

    const { currentDate, isPaymentPopupOpen, onClose, onPaymentPopup, createPayment, payments, getDatePayment } = props;
    const [order, setOrder] = useState('');
    const [amount, setAmount] = useState('');
    const [comment, setComment] = useState('');

    function handleChangeItemDate(evt) {
        getDatePayment(evt.target.value);
        window.localStorage.setItem('date', evt.target.value);
    }

    function handleChangeOrder(evt) {
        setOrder(evt.target.value);
    }

    function handleChangeAmount(evt) {
        setAmount(evt.target.value);
    }

    function handleChangeComment(evt) {
        setComment(evt.target.value);
    }

    function handlePaymentSubmit(evt) {
        evt.preventDefault();
        createPayment({ order, amount, comment });
        onClose();
    }

    return (
        <>
            <div class="rate_header">
                <button class="payments_insert" onClick={onPaymentPopup}>Записать</button>
                <input class="main_input-date" type="date" value={window.localStorage.getItem('date')} onChange={handleChangeItemDate} />
            </div>
            <div class="payments__main">
                <div class="payment__orders">
                    <div class="payments__titles">
                        <div class="payments_title">Ордер</div>
                        <div class="payments_title">Сумма</div>
                        <div class="payments_title-comment">Комментарий</div>
                        <div class="payments_title">Дата</div>
                    </div>
                    {payments.flat().length ? payments.flat().reverse().map((payment, index) => {
                        return <div class="payments__rows" key={index}>
                            <div class="payments_cell">{payment.id}</div>
                            <div class="payments_cell">{payment.amount}</div>
                            <div class="payments_cell-comment">{payment.comment}</div>
                            <div class="payments_cell">{payment.allDate}</div>
                        </div>
                    }) : null}
                </div>
            </div>
            <div className={`popup_purchase ${isPaymentPopupOpen ? 'popup_opened' : ''}`}>
                <div className="popup__container">
                    <form className="popup__form" name="popup__form" noValidate="" onSubmit={handlePaymentSubmit}>
                        <button className="popup__close-icon" type="button" onClick={onClose} />
                        <h2 className="popup__title">Введите данные по спорному платежу!</h2>
                        <input
                            className="popup__field popup__field_type_name"
                            type="text"
                            placeholder="Номер ордера"
                            name="exchange"
                            value={order || ''}
                            onChange={handleChangeOrder}
                            required
                            minLength={2}
                            maxLength={40}
                        />
                        <span className="popup__span popup__span_name" />
                        <input
                            className="popup__field popup__field_type_occupation"
                            type="text"
                            placeholder="Сумма закупа"
                            name="amount"
                            value={amount || ''}
                            onChange={handleChangeAmount}
                            required
                            minLength={2}
                            maxLength={200}
                        />
                        <span className="popup__span popup__span_about" />
                        <input
                            className="popup__field popup__field_type_occupation"
                            type="text"
                            placeholder="Комментарий"
                            name="amount"
                            value={comment || ''}
                            onChange={handleChangeComment}
                            required
                            minLength={2}
                            maxLength={200}
                        />
                        <span className="popup__span popup__span_about" />
                        <button className="popup__submit" type="submit" name="form__submit">Внести данные</button>
                    </form>
                </div>
            </div>
        </>
    )
};