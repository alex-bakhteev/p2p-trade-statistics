import React, { useState } from "react";
import { ReactComponent as Search } from "../images/search.svg";
import { ReactComponent as Close } from "../images/close.svg";

export const Rate = (props) => {

    const { purchases, getDatePurchase, getOnePurchase, insertDate, setInsertDate, purchaseFind, onClose, onNumber, isNumberPopupOpen } = props;
    const [find, setFind] = useState('');
    const [procurement, setProcurement] = useState([]);

    function handleChangeItemDate(evt) {
        getDatePurchase(evt.target.value);
        setInsertDate(evt.target.value);
        window.localStorage.setItem('date', evt.target.value);
    }

    function handleChangeFind(evt) {
        setFind(evt.target.value);
    }

    function handleFindPurchase() {
        if (find.length > 0) {
            if (window.localStorage.getItem('findRate') === '') {
                window.localStorage.setItem('findRate', find);
                getOnePurchase(find);
            }
            else {
                window.localStorage.setItem('findRate', '');
            }
        }
    }

    function handleButtonClick(evt) {
        if (purchases.length > 0) {
            const currentProcurement = {
                id: purchases[evt.target.id]._id,
                exchangeBuy: purchases[evt.target.id].exchangeBuy,
                amount: purchases[evt.target.id].amount,
                averageExchange: purchases[evt.target.id].averageExchange,
                allAmount: purchases[evt.target.id].allAmount
            };
            setProcurement(currentProcurement);
        }
        onNumber();
    }

    return (
        <>
            <div className="rate">
                <div className="main_header-row">
                    <input class="main_input-date" type="date" value={window.localStorage.getItem('date')} onChange={handleChangeItemDate} />
                    <div className="main_text-or">Или</div>
                    <div className="main_find">
                        <input className="main_search-field"
                            type="text" placeholder="Поиск по ID:" name="findOrder" value={find}
                            onChange={handleChangeFind} required minLength={10} maxLength={50} />
                        <button class="main_search" onClick={handleFindPurchase}>
                            {
                                window.localStorage.getItem('findMain').length > 0 ? <Close className="main_search-image" /> : <Search className="main_search-image" />
                            }
                        </button>
                    </div>
                </div>
                <div className="rate_main">
                    <div class="main__titles">
                        <div class="rate__title-purchase">ID закупа</div>
                        <div class="rate__title">Общий курс</div>
                        <div class="rate__title">Общая сумма</div>
                        <div class="rate__title">Дата закупа</div>
                        <div class="rate__title"></div>
                    </div>
                    {purchases.length > 0 && window.localStorage.getItem('findRate').length === 0 ? purchases.map((purchase, index) => {
                        return <div class="main__rows" key={index}>
                            <div class="rate__cell-purchase">{purchase._id}</div>
                            <div class="rate__cell">{purchase.averageExchange.toFixed(2)}</div>
                            <div class="rate__cell">{purchase.allAmount.toFixed(0)}</div>
                            <div class="rate__cell">{purchase.allDate}</div>
                            <div className="rate__cell"><button id={index} className="rate_button" onClick={handleButtonClick}>Подробнее</button></div>
                        </div>
                    }) : Object.keys(purchaseFind).length !== 0 ? <div className="rate_basic">
                        <div class="rate__titles">
                            <div class="rate__title-purchase">{purchaseFind._id}</div>
                            <div className="rate_title-row">
                                <div class="rate__title">Курс закупки</div>
                                <div class="rate__title">Сумма закупки</div>
                            </div>
                        </div>
                        {
                            purchaseFind.exchangeBuy.map((item, index) => {
                                return <div class="rate__rows" key={index}>
                                    <div class="rate__cell">{item}</div>
                                    <div class="rate__cell">{purchaseFind.amount[index]}</div>
                                </div>
                            }
                            )
                        }
                        <div class="rate_result">
                            <div class="rate_cell-result">Итог:</div>
                            <div className="rate_cell-row">
                                <div class="rate__cell">{purchaseFind.averageExchange.toFixed(2)}</div>
                                <div class="rate__cell">{purchaseFind.allAmount}</div>
                            </div>
                        </div>
                    </div> : null
                    }
                </div>
            </div>
            <div className={`popup_number ${isNumberPopupOpen ? 'popup_opened' : ''}`}>
                <div className="popup__container">
                    <div className="popup__form-number">
                        <button className="popup__close-icon" type="button" onClick={onClose} />
                        {Object.keys(procurement).length !== 0 ? <>
                            <h2 className="popup__title">Информация о закупе {procurement._id}</h2>
                            <div className="popup_box">
                                {procurement.exchangeBuy.map((item, index) => {
                                    return <div key={index}>
                                        <div className="popup_box-row">
                                            <div className="popup_box-item">Закуп {index + 1}</div>
                                            <div className="popup_box-item">Курс: {item}</div>
                                            <div className="popup_box-item">Сумма: {procurement.amount[index]}</div>
                                        </div>
                                    </div>
                                })}
                                <div className="popup_box-end">
                                    <div className="popup_box-all">Средний курс: {procurement.averageExchange.toFixed(2)}</div>
                                    <div className="popup_box-all">Общая сумма: {procurement.allAmount.toFixed(0)}</div>
                                </div>
                            </div>
                        </> : null}
                    </div>
                </div>
            </div>
        </>
    )
};