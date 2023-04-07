import React, { useContext, useState, useEffect } from "react";
import { Deal } from './Deal';
import { ReactComponent as Search } from "../images/search.svg";
import { ReactComponent as Close } from "../images/close.svg";

export const Main = (props) => {

    const { isPurchase, setIsPurchase, currentDate, dateDeals, onDealDate, onPurchase, onClose, isOpenDeletePurchase, onDeletePurchase, getPurchase, purchase,
        isOpenPurchase, onSubmit, getOneDeal, createPurchase, isOpenEditPurchase, onEditPurchase, fulfilled, updatePurchase,
        averageExchange, setAverageExchange, allAmount, setAllAmount, isFindMain, insertDate, setInsertDate, editExchange, setEditExchange,
        editAmount, setEditAmount, userUpdatePurchase } = props;
    const [exchange, setExchange] = useState(Number);
    const [amount, setAmount] = useState(Number);
    const [find, setFind] = useState('');
    const totalProfit = (dateDeals.flat().map((item) => Number(item.earn)).reduce((accumulator, currentValue) => accumulator + currentValue, 0)) - (Number(window.localStorage.getItem('network')) + Number(window.localStorage.getItem('site')));

    function handleChangeExchange(evt) {
        setExchange(evt.target.value);
    }

    function handleChangeAmount(evt) {
        setAmount(evt.target.value);
    }

    function handleChangeEditExchange(evt) {
        const popupEdit = document.querySelector('.popup_edit-purchase');
        const exchangeValueInputs = Array.from(popupEdit.querySelectorAll('.popup__field_type_name')).map(inputElement => inputElement.value);
        const exchangeIdInputs = Array.from(popupEdit.querySelectorAll('.popup__field_type_name')).map(inputElement => inputElement.id);
        const currentEditExchange = [];
        exchangeIdInputs.forEach((item, index) => {
            if (item === evt.target.id) {
                currentEditExchange[index] = evt.target.value;
            }
            else {
                currentEditExchange[index] = exchangeValueInputs[index];
            }
        });
        setEditExchange(currentEditExchange);
    }

    function handleChangeEditAmount(evt) {
        const popupEdit = document.querySelector('.popup_edit-purchase');
        const amountValueInputs = Array.from(popupEdit.querySelectorAll('.popup__field_type_occupation')).map(inputElement => inputElement.value);
        const amountIdInputs = Array.from(popupEdit.querySelectorAll('.popup__field_type_occupation')).map(inputElement => inputElement.id);
        const currentEditAmount = [];
        amountIdInputs.forEach((item, index) => {
            if (item === evt.target.id) {
                currentEditAmount[index] = evt.target.value;
            }
            else {
                currentEditAmount[index] = amountValueInputs[index];
            }
        });
        setEditAmount(currentEditAmount);
    }

    function handleChangeFind(evt) {
        setFind(evt.target.value);
    }

    function handlePurchaseSubmit(evt) {
        evt.preventDefault();
        if (purchase[0] !== undefined) {
            if (purchase[0].fulfilled !== true) {
                purchase[0].exchangeBuy.push(exchange);
                purchase[0].amount.push(amount);
                const sum = purchase[0].amount.map(Number).reduce((accumulator, currentValue) => accumulator + currentValue, 0);
                const divider = purchase[0].exchangeBuy.map((item, index) => Number(purchase[0].amount[index]) / Number(item));
                const dividerSum = divider.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
                const avgExchange = sum / dividerSum.toFixed(2);
                setAverageExchange(avgExchange.toFixed(2));
                setAllAmount(sum);
                updatePurchase(
                    {
                        exchange: purchase[0].exchangeBuy,
                        amount: purchase[0].amount,
                        fulfilled: purchase[0].fulfilled,
                        averageExchange: avgExchange,
                        allAmount: sum,
                        token: purchase[0].token
                    }
                );
            }
            else {
                setAverageExchange(0);
                setAllAmount(0);
                createPurchase({ exchange, amount, fulfilled });
            }
        }
        else {
            setAverageExchange(exchange);
            setAllAmount(amount);
            createPurchase({ exchange, amount, fulfilled });
        }
        onClose();
    }

    function handleEditSubmit(evt) {
        evt.preventDefault();
        const popupEdit = document.querySelector('.popup_edit-purchase');
        const exchangeInputs = Array.from(popupEdit.querySelectorAll('.popup__field_type_name')).map(inputElement => inputElement.value);
        const amountInputs = Array.from(popupEdit.querySelectorAll('.popup__field_type_occupation')).map(inputElement => inputElement.value);
        const sum = amountInputs.map(Number).reduce((accumulator, currentValue) => accumulator + currentValue, 0);
        const divider = exchangeInputs.map((item, index) => Number(amountInputs[index]) / Number(item));
        const dividerSum = divider.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
        const avgExchange = sum / dividerSum.toFixed(2);
        setAverageExchange(avgExchange.toFixed(2));
        setAllAmount(sum);
        updatePurchase(
            {
                exchange: exchangeInputs,
                amount: amountInputs,
                fulfilled: purchase[0].fulfilled,
                averageExchange: avgExchange,
                allAmount: sum,
                token: purchase[0].token
            }
        );
        onClose();
        window.location.reload();
    }

    function handleDeleteSubmit(evt) {
        evt.preventDefault();
        updatePurchase(
            {
                exchange: purchase[0].exchangeBuy,
                amount: purchase[0].amount,
                fulfilled: true,
                averageExchange: purchase[0].averageExchange,
                allAmount: purchase[0].allAmount,
                token: purchase[0].token
            }
        );
        userUpdatePurchase(false);
        setExchange(0);
        setAmount(0);
        setIsPurchase(false);
        onClose();
        window.location.reload();
    }

    function handleFindOrder() {
        if (find.length > 0) {
            if (window.localStorage.getItem('findMain') === '') {
                getOneDeal(Number(find));
                window.localStorage.setItem('findMain', find);
            }
            else {
                window.localStorage.setItem('findMain', '');
            }
        }
    }

    function handleChangeItemDate(evt) {
        onDealDate((evt.target.value.split('-').reverse().join('.').replace('2023', '23')));
        setInsertDate(evt.target.value);
        window.localStorage.setItem('date', evt.target.value);
    }

    return (
        <>
            <div class="main__header">
                <div className="main_header-row">
                    <input class="main_input-date" type="date" value={window.localStorage.getItem('date')} onChange={handleChangeItemDate} />
                    <div className="main_text-or">Или</div>
                    <div className="main_find">
                        <input className="main_search-field"
                            type="text" placeholder="Поиск по ID:" name="findOrder" value={find}
                            onChange={handleChangeFind} required minLength={10} maxLength={50} />
                        <button class="main_search" onClick={handleFindOrder}>
                            {
                                window.localStorage.getItem('findMain').length > 0 ? <Close className="main_search-image" /> : <Search className="main_search-image" />
                            }
                        </button>
                    </div>
                </div>
                <div class="main_numbers-row">
                    <button class="main_button" onClick={onPurchase}>Ввести</button>
                    <button class="main_button" onClick={onEditPurchase}>Изменить</button>
                    <button class="main_button" onClick={onDeletePurchase}>Удалить</button>
                    <div className="main_number">Текущий курс: {isPurchase ? averageExchange : exchange}</div>
                    <div className="main_number">Текущая сумма: {isPurchase ? allAmount : amount}</div>
                    <div className="main_all-amout">Общая прибыль: {totalProfit.toFixed(2)}</div>
                </div>
            </div>
            <div class="main__titles">
                <div class="main__title">Номер ордера</div>
                <div class="main__title">ID закупа</div>
                <div class="main__title">Курс закупа</div>
                <div class="main__title">Курс площадки</div>
                <div class="main__title">Получено RUB</div>
                <div class="main__title">Эквивалент USDT</div>
                <div class="main__title">Прибыль в RUB</div>
                <div class="main__title">Спред</div>
            </div>
            {dateDeals ? dateDeals.flat().reverse().map((deal, index) =>
                <Deal
                    key={index}
                    deal={deal}
                />
            ) : null}
            <div className={`popup_purchase ${isOpenPurchase ? 'popup_opened' : ''}`}>
                <div className="popup__container">
                    <form className="popup__form" name="popup__form" noValidate="" onSubmit={handlePurchaseSubmit}>
                        <button className="popup__close-icon" type="button" onClick={onClose} />
                        <h2 className="popup__title">Введите курс и сумму закупа!</h2>
                        <input
                            className="popup__field popup__field_type_name"
                            type="number"
                            placeholder="Курс закупа"
                            name="exchange"
                            value={exchange || ''}
                            onChange={handleChangeExchange}
                            required
                            minLength={2}
                            maxLength={40}
                        />
                        <span className="popup__span popup__span_name" />
                        <input
                            className="popup__field popup__field_type_occupation"
                            type="number"
                            placeholder="Сумма закупа"
                            name="amount"
                            value={amount || ''}
                            onChange={handleChangeAmount}
                            required
                            minLength={2}
                            maxLength={200}
                        />
                        <span className="popup__span popup__span_about" />
                        <button className="popup__submit" type="submit" name="form__submit">Внести данные</button>
                    </form>
                </div>
            </div>
            <div className={`popup_edit-purchase ${isOpenEditPurchase ? 'popup_opened' : ''}`}>
                <div className="popup__container">
                    <form className="popup__form" name="popup__form" noValidate="" onSubmit={handleEditSubmit}>
                        <button className="popup__close-icon" type="button" onClick={onClose} />
                        <h2 className="popup__title">Редактирование закупа!</h2>
                        {purchase.length ? purchase[0].exchangeBuy.map((item, index) => {
                            return <div className="popup_tokens" key={index}>
                                <input
                                    id={index}
                                    className="popup__field popup__field_type_name"
                                    type="number"
                                    placeholder="Курс закупа"
                                    name="exchange"
                                    value={editExchange[index]}
                                    onChange={handleChangeEditExchange}
                                    required
                                    minLength={2}
                                    maxLength={40}
                                />
                                <span className="popup__span popup__span_name">Курс {index + 1}</span>
                                <input
                                    id={index}
                                    className="popup__field popup__field_type_occupation"
                                    type="number"
                                    placeholder="Сумма закупа"
                                    name="amount"
                                    value={editAmount[index]}
                                    onChange={handleChangeEditAmount}
                                    required
                                    minLength={2}
                                    maxLength={200}
                                />
                                <span className="popup__span popup__span_name">Сумма {index + 1}</span>
                            </div>
                        }) : null}
                        <button className="popup__submit" type="submit" name="form__submit">Внести данные</button>
                    </form>
                </div>
            </div>
            <div className={`popup_delete-purchase ${isOpenDeletePurchase ? 'popup_opened' : ''}`}>
                <div className="popup__container">
                    <form className="popup__form" name="popup__form" noValidate="" onSubmit={handleDeleteSubmit}>
                        <button className="popup__close-icon" type="button" onClick={onClose} />
                        <h2 className="popup__title">Вы уверены?</h2>
                        <button className="popup__submit" type="submit" name="form__submit">Да</button>
                    </form>
                </div>
            </div>
        </>
    )
};