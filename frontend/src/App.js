import React, { useState, useEffect } from "react";
import { Routes, Route, Link } from "react-router-dom";
import { ReactComponent as Site } from "./images/1.svg";
import { ReactComponent as Circle } from "./images/circle.svg";
import { ReactComponent as Token } from "./images/5.svg";
import { ReactComponent as Exchange } from "./images/2.svg";
import { ReactComponent as Stock } from "./images/4.svg";
import { ReactComponent as Exit } from "./images/exit.svg";
import axios from "axios";

import { Rate } from "./pages/Rate";
import { Main } from "./pages/Main";
import { Payments } from "./pages/Payments";
import { AuthPage } from "./pages/AuthPage";

const App = () => {

  const date = new Date();
  const currentDate = new Date(date.getTime() - (date.getTimezoneOffset() * 60000)).toJSON().slice(0, -14);
  const [isAuth, setIsAuth] = useState(false);
  const [isAuthPageOpen, setIsAuthPageOpen] = useState(false);
  const [isPurchasePopupOpen, setIsPurchasePopupOpen] = useState(false);
  const [isEditPurchasePopupOpen, setIsEditPurchasePopupOpen] = useState(false);
  const [isDeletePurchasePopupOpen, setIsDeletePurchasePopupOpen] = useState(false);
  const [isPaymentPopupOpen, setIsPaymentPopupOpen] = useState(false);
  const [isFeePopupOpen, setIsFeePopupOpen] = useState(false);
  const [isTokenPopupOpen, setIsTokenPopupOpen] = useState(false);
  const [isNumberPopupOpen, setIsNumberPopupOpen] = useState(false);
  const [payments, setPayments] = useState([]);
  const [purchase, setPurchase] = useState([]);
  const [purchaseFind, setPurchaseFind] = useState([]);
  const [purchases, setPurchases] = useState([]);
  const [isPurchase, setIsPurchase] = useState(false);
  const [isFulfilled, setIsFulfilled] = useState(false);
  const [averageExchange, setAverageExchange] = useState(0);
  const [allAmount, setAllAmount] = useState(0);
  const [dateDeals, setDateDeals] = useState([]);
  const [bitconceTokens, setBitconceTokens] = useState([]);
  const [insertDate, setInsertDate] = useState(window.localStorage.getItem('date'));
  const [network, setNetwork] = useState('');
  const [site, setSite] = useState('');
  const [tokensBitconce, setTokensBitconce] = useState([]);
  const [showTokens, setShowTokens] = useState(false);
  const [showBitconce, setShowBitconce] = useState(false);
  const [editExchange, setEditExchange] = useState([]);
  const [editAmount, setEditAmount] = useState([]);
  const [currentPurchases, setCurrentPurchases] = useState([]);

  useEffect(() => {
    async function fetchData() {
      await getUserTokens();
      const interval = setInterval(async () => {
        const currentBitconce = [];
        const bitconcePurchases = [];
        await axios.post('https://localhost:4444/auth/me', {
          id: window.localStorage.getItem('userID')
        })
          .then((user) => {
            currentBitconce.push(user.data.tokenBitconce);
            bitconcePurchases.push(user.data.currentPurchase);
          })
          .catch((err) => {
            console.log(err)
          });
        await Promise.all(currentBitconce.flat().map(async (item, index) => {
          const freshDeals = [];
          const freshOrders = [];
          let avgExchange = Number;
          let buyID = String;
          await axios.post('https://localhost:4444/deals/get', {
            token: item
          })
            .then((deals) => {
              if (deals.data !== undefined) {
                freshDeals.push(deals.data);
              }
            })
            .catch((err) => {
              console.log(err)
            });
          await axios.post('https://localhost:4444/orders/get', {
            token: item
          })
            .then((orders) => {
              freshOrders.push(orders.data);
            })
            .catch((err) => {
              console.log(err)
            });
          if (window.localStorage.getItem('currentPurchase') !== '') {
            await axios.post('https://localhost:4444/purchase/:id', {
              id: bitconcePurchases.flat()[index]
            })
              .then((res) => {
                if (res.data !== undefined) {
                  if (bitconcePurchases.flat()[index] !== window.localStorage.getItem('currentPurchase')) {
                    avgExchange = res.data[0].averageExchange.toFixed(2);
                    buyID = res.data[0]._id;
                  }
                  else {
                    setPurchase(res.data);
                    setAverageExchange(res.data[0].averageExchange.toFixed(2));
                    setAllAmount(res.data[0].allAmount);
                    avgExchange = res.data[0].averageExchange.toFixed(2);
                    buyID = res.data[0]._id;
                    if (res.data[0].fulfilled !== true) {
                      setIsPurchase(true);
                    }
                  }
                }
              })
              .catch((err) => {
                console.log(err)
              });
          }
          else {
            setPurchase([]);
            setAverageExchange(0);
            setAllAmount(0);
          }
          const currentDeals = [];
          const checkOrders = freshOrders.flat();
          const checkDeals = freshDeals.flat();
          if (checkOrders.length && avgExchange !== 0) {
            for (let i = 0; checkOrders.length > i; i++) {
              if (!(checkDeals.some((element) => element.id === checkOrders[i].id))) {
                const profit = (checkOrders[i].exchange * checkOrders[i].usdt) - (avgExchange * checkOrders[i].usdt);
                const percent = ((checkOrders[i].exchange / avgExchange) - 1) / 0.01;
                currentDeals.push({
                  id: checkOrders[i].id,
                  exchangeBuyID: buyID,
                  exchangeBuy: `${avgExchange}`,
                  exchangePlatform: checkOrders[i].exchange,
                  received: checkOrders[i].received,
                  usdt: checkOrders[i].usdt,
                  earn: profit.toFixed(2),
                  spread: percent.toFixed(2),
                  date: checkOrders[i].date,
                  token: checkOrders[i].token,
                });
              }
            };
            await handleAddDeal(currentDeals);
          }
        }));
        if (window.localStorage.getItem('findMain') === '') {
          await getDateDeal();
        }
        else {
          getOneDeal(window.localStorage.getItem('findMain'));
        }
        if (window.localStorage.getItem('findRate') === '') {
          if (window.localStorage.getItem('date') !== currentDate) {
            await getDatePurchase(window.localStorage.getItem('date'));
          }
          else {
            await getDatePurchase(currentDate);
          }
        }
        else {
          await getOnePurchase(window.localStorage.getItem('findRate'));
        }
        if (window.localStorage.getItem('date') !== currentDate) {
          await getDatePayment(window.localStorage.getItem('date'));
        }
        else {
          await getDatePayment(currentDate);
        }
      }, 2000);
      return () => clearInterval(interval);
    }
    if (window.localStorage.getItem('token')) {
      setIsAuth(true);
      fetchData();
    }
  }, []);

  async function getDateDeal() {
    await axios.post('https://localhost:4444/sort', {
      date: window.localStorage.getItem('date').split('-').reverse().join('.').replace('2023', '23'),
      token: window.localStorage.getItem('setBitconce')
    })
      .then((deals) => {
        setDateDeals([deals.data.flat()]);
      })
      .catch((err) => {
        console.log(err)
      });
  }

  async function getOneDeal(id) {
    await axios.post('https://localhost:4444/deals/one', {
      id: id
    })
      .then((deals) => {
        setDateDeals([deals.data.flat()]);
      })
      .catch((err) => {
        console.log(err)
      });
  }

  async function handleAddDeal(currentDeals) {
    await axios.post('https://localhost:4444/deals/create', {
      deals: currentDeals,
    })
      .catch((err) => {
        console.log(err)
      });
  }

  async function getUserInfo({ email, password }) {
    await axios.post('https://localhost:4444/auth/login', {
      email: email,
      password: password
    })
      .then((res) => {
        setIsAuth(true);
        setBitconceTokens(res.data.tokenBitconce);
        setCurrentPurchases(res.data.currentPurchase);
        window.localStorage.setItem('setBitconce', res.data.tokenBitconce[0]);
        window.localStorage.setItem('token', res.data.token);
        window.localStorage.setItem('userID', res.data._id);
        if (res.data.currentPurchase[0] !== undefined) {
          window.localStorage.setItem('currentPurchase', res.data.currentPurchase[0]);
        }
        else {
          window.localStorage.setItem('currentPurchase', '');
        }
        window.localStorage.setItem('findMain', '');
        window.localStorage.setItem('findRate', '');
        window.localStorage.setItem('date', currentDate);
        window.localStorage.setItem('network', res.data.network);
        window.localStorage.setItem('site', res.data.site);
        window.location.reload();
      })
      .catch((err) => {
        console.log(err);
        alert('Неверные логин или пароль!');
      });
  }

  async function getUserTokens() {
    await axios.post('https://localhost:4444/auth/me', {
      id: window.localStorage.getItem('userID')
    })
      .then((res) => {
        const internalActiveBitconce = [];
        res.data.tokenBitconce.find((item, index) => {
          if (item === window.localStorage.getItem('setBitconce')) {
            internalActiveBitconce.push(index);
          }
        });
        setBitconceTokens(res.data.tokenBitconce);
        setCurrentPurchases(res.data.currentPurchase);
        if (res.data.currentPurchase[internalActiveBitconce] !== undefined) {
          window.localStorage.setItem('currentPurchase', res.data.currentPurchase[internalActiveBitconce]);
        }
        else {
          window.localStorage.setItem('currentPurchase', '');
        }
      })
      .catch((err) => {
        console.log(err)
      });
  }

  async function userUpdateFee({ network, site }) {
    await axios.post('https://localhost:4444/auth/fee', {
      id: window.localStorage.getItem('userID'),
      network: network,
      site: site,
    })
      .catch((err) => {
        console.log(err)
      });
  }

  async function userUpdateToken(newTokens) {
    await axios.post('https://localhost:4444/auth/token', {
      id: window.localStorage.getItem('userID'),
      tokenBitconce: newTokens,
    })
      .catch((err) => {
        console.log(err)
      });
  }

  async function userUpdatePurchase(currentItem) {
    if (currentItem !== false) {
      const internalActiveBitconce = [];
      bitconceTokens.find((item, index) => {
        if (item === window.localStorage.getItem('setBitconce')) {
          internalActiveBitconce.push(index);
        }
      });
      currentPurchases[internalActiveBitconce] = currentItem;
    }
    else {
      const internalActiveBitconce = [];
      bitconceTokens.find((item, index) => {
        if (item === window.localStorage.getItem('setBitconce')) {
          internalActiveBitconce.push(index);
        }
      });
      currentPurchases[internalActiveBitconce] = '';
    }
    await axios.post('https://localhost:4444/auth/purchase', {
      id: window.localStorage.getItem('userID'),
      currentPurchase: currentPurchases,
    })
      .catch((err) => {
        console.log(err)
      });
  }

  async function createPurchase({ exchange, amount, fulfilled }) {
    const avgExchange = Number(exchange);
    const allAmount = Number(amount);
    const created = new Date(date.getTime() - (date.getTimezoneOffset() * 60000)).toJSON().slice(0, -8).split('T').join(', ');
    await axios.post('https://localhost:4444/purchase', {
      exchangeBuy: exchange,
      amount: amount,
      fulfilled: fulfilled,
      averageExchange: avgExchange,
      allAmount: allAmount,
      datePurchase: currentDate,
      allDate: created,
      token: window.localStorage.getItem('setBitconce'),
    })
      .then((res) => {
        window.localStorage.setItem('currentPurchase', res.data);
        async function fetchMain() {
          await getPurchase();
          await userUpdatePurchase(res.data);
        }
        fetchMain();
      })
      .catch((err) => {
        console.log(err)
      });
  }

  async function createPayment({ order, amount, comment }) {
    const created = new Date(date.getTime() - (date.getTimezoneOffset() * 60000)).toJSON().slice(0, -8).split('T').join(', ');
    await axios.post('https://localhost:4444/payment/create', {
      id: order,
      amount: amount,
      comment: comment,
      date: currentDate,
      allDate: created,
      token: window.localStorage.getItem('setBitconce'),
    })
      .catch((err) => {
        console.log(err);
        alert('Ошибка!');
      });
  }

  async function getDatePayment(itemDate) {
    await axios.post('https://localhost:4444/payment/sort', {
      date: itemDate,
      token: window.localStorage.getItem('setBitconce')
    })
      .then((payments) => {
        setPayments([payments.data.flat()]);
      })
      .catch((err) => {
        console.log(err)
      });
  }

  async function getPurchase() {
    await axios.post('https://localhost:4444/purchase/:id', {
      id: window.localStorage.getItem('currentPurchase')
    })
      .then((res) => {
        if (res.data !== undefined) {
          setPurchase(res.data);
          setAverageExchange(res.data[0].averageExchange.toFixed(2));
          setAllAmount(res.data[0].allAmount);
          return res.data[0].averageExchange.toFixed(2);
        }
      })
      .catch((err) => {
        console.log(err)
      });
  }

  async function getDatePurchase(itemDate) {
    await axios({
      method: "get",
      url: `https://localhost:4444/purchase`,
      params: {
        datePurchase: itemDate,
        token: window.localStorage.getItem('setBitconce')
      }
    })
      .then((purchases) => {
        const currentPurchases = purchases.data.flat();
        setPurchases(currentPurchases);
      })
      .catch((err) => {
        console.log(err)
      });
  }

  async function getOnePurchase(purchaseID) {
    await axios.post('https://localhost:4444/purchase/:id', {
      id: purchaseID
    })
      .then((purchases) => {
        const currentPurchaseFind = purchases.data[0];
        setPurchaseFind(currentPurchaseFind);
      })
      .catch((err) => {
        console.log(err)
      });
  }

  async function updateCurrentPurchase({ exchange, amount, fulfilled, averageExchange, allAmount, token }) {
    const created = new Date(date.getTime() - (date.getTimezoneOffset() * 60000)).toJSON().slice(0, -8).split('T').join(', ');
    await axios.patch('https://localhost:4444/purchase/update', {
      exchangeBuy: exchange,
      amount: amount,
      fulfilled: fulfilled,
      averageExchange: averageExchange,
      allAmount: allAmount,
      token: token,
      datePurchase: currentDate,
      allDate: created,
      id: window.localStorage.getItem('currentPurchase')
    })
      .catch((err) => {
        console.log(err)
      });
  }

  async function updateAllOrders(index, item) {
    await axios.post('https://localhost:4444/orders/update', {
      token: bitconceTokens[index],
      newToken: item
    })
      .catch((err) => {
        console.log(err)
      });
  }

  async function updateAllDeals(index, item) {
    await axios.post('https://localhost:4444/deals/update', {
      token: bitconceTokens[index],
      newToken: item
    })
      .catch((err) => {
        console.log(err)
      });
  }

  async function updateAllPurchases(index, item) {
    await axios.post('https://localhost:4444/purchase/all', {
      token: bitconceTokens[index],
      newToken: item
    })
      .catch((err) => {
        console.log(err)
      });
  }

  async function updateAllPayments(index, item) {
    await axios.post('https://localhost:4444/payment/update', {
      token: bitconceTokens[index],
      newToken: item
    })
      .catch((err) => {
        console.log(err)
      });
  }

  function logout() {
    setIsAuth(false);
    window.localStorage.clear('token');
    window.location.reload();
  }

  function setBitconce(evt) {
    window.localStorage.setItem('setBitconce', evt.target.title);
    getUserTokens();
  }

  function handleEditPurchaseClick() {
    setIsEditPurchasePopupOpen(true);
    setEditExchange(purchase[0].exchangeBuy);
    setEditAmount(purchase[0].amount);
  }

  function handleDeletePurchaseClick() {
    setIsDeletePurchasePopupOpen(true);
  }

  function handlePaymentClick() {
    setIsPaymentPopupOpen(true);
  }

  function handlePurchaseClick() {
    setIsPurchasePopupOpen(true);
  }

  function handleFeeClick() {
    setIsFeePopupOpen(true);
    setNetwork(window.localStorage.getItem('network'));
    setSite(window.localStorage.getItem('site'));
  }

  function handleTokenClick() {
    setIsTokenPopupOpen(true);
    setTokensBitconce(bitconceTokens);
  }

  function handleNumberClick() {
    setIsNumberPopupOpen(true);
  }

  function closeAllPopups() {
    setIsPurchasePopupOpen(false);
    setIsEditPurchasePopupOpen(false);
    setIsDeletePurchasePopupOpen(false);
    setIsPaymentPopupOpen(false);
    setIsFeePopupOpen(false);
    setIsTokenPopupOpen(false);
    setIsNumberPopupOpen(false);
  }

  function handleChangeNetwork(evt) {
    setNetwork(evt.target.value);
  }

  function handleChangeSite(evt) {
    setSite(evt.target.value);
  }

  function handleChangeTokens(evt) {
    const popupBitconce = document.querySelector('.popup_bitconce');
    const tokenIDInputs = Array.from(popupBitconce.querySelectorAll('.popup__field_type_occupation')).map(inputElement => inputElement.id);
    const currentEditToken = [];
    tokenIDInputs.forEach((item) => {
      if (item === evt.target.id) {
        currentEditToken[item] = evt.target.value;
      }
      else {
        currentEditToken[item] = bitconceTokens[item];
      }
    });
    setTokensBitconce(currentEditToken);
  }

  function handleFeeSubmit(evt) {
    evt.preventDefault();
    userUpdateFee({ network, site });
    window.localStorage.setItem('network', network);
    window.localStorage.setItem('site', site);
    closeAllPopups();
  }

  function handleTokenSubmit(evt) {
    evt.preventDefault();
    const popupBitconce = document.querySelector('.popup_bitconce');
    const tokenInputs = Array.from(popupBitconce.querySelectorAll('.popup__field_type_occupation')).map(inputElement => inputElement.value);
    const newTokens = [];
    for (let i = 0; tokenInputs.length > i; i++) {
      if (tokenInputs[i] !== bitconceTokens[i]) {
        newTokens[i] = tokenInputs[i];
      }
    }
    if (newTokens.length > 0) {
      newTokens.map((item, index) => {
        updateAllOrders(index, item);
        updateAllDeals(index, item);
        updateAllPurchases(index, item);
        updateAllPayments(index, item);
        tokenInputs[index] = item;
      })
      userUpdateToken(tokenInputs);
      getUserTokens();
    }
    closeAllPopups();
  }

  function handleChangeShowTokens() {
    if (showTokens === true) {
      setShowTokens(false);
    }
    else {
      setShowTokens(true);
    }
  }

  function handleChangeShowBitconce() {
    if (showBitconce === true) {
      setShowBitconce(false);
    }
    else {
      setShowBitconce(true);
    }
  }

  if (isAuth) {
    return (
      <>
        <div className="page">
          <div className="tools">
            <div>
              <div className="tools_helper">
                <div className="tools_icon-helper">
                  <Circle className="tools_circle" />
                  P2P-Helper
                </div>
              </div>
              <div className="tools_bitconce">
                <div className="tools_bitconce-row" onClick={handleChangeShowBitconce}>
                  <Site className="tools_bitconce-image" /> <div className="tools_bitconce-text">Площадки</div>
                </div>
                {showBitconce === true ? <>
                  <div className="tools_bitconce-row" onClick={handleChangeShowTokens}>
                    <Stock className="tools_bitconce-image" /> <div className="tools_bitconce-text">Bitconce</div>
                  </div>
                  {bitconceTokens.length && showTokens === true ? bitconceTokens.map((item, index) => {
                    return <div className="tools_tokens" key={index}>
                      <button id={index} className={`tools_button-token ${item === window.localStorage.getItem('setBitconce') ? 'tools_button-active' : ''}`}
                        title={item} onClick={setBitconce}>Токен {index + 1}</button>
                    </div>
                  }) : null}
                </> : null}
              </div>
            </div>
            <div className="tools_profile">
              <button class="tools_button" onClick={handleTokenClick}><Token className="tools_token-image" />
                <div className="tools_bitconce-text">Токены</div></button>
              <button class="tools_button" onClick={handleFeeClick}><Exchange className="tools_token-image" />
                <div className="tools_bitconce-text">Комиссии</div></button>
              <button className="tools_button" onClick={logout}><Exit className="tools_exit-image" />
                <div className="tools_bitconce-text">Выход!</div></button>
            </div>
          </div>
          <div className="basic">
            <header className="header">
              <Link to="main" className="header__link header__main">Главная</Link>
              <Link to="rate" className="header__link header__rate">Закупы</Link>
              <Link to="payments" className="header__link header__payments">Спорные платежи</Link>
            </header>
            <main className="main">
              <Routes>
                <Route path="/main" exact element={
                  <Main
                    dateDeals={dateDeals}
                    currentDate={currentDate}
                    onDealDate={getDateDeal}
                    getOneDeal={getOneDeal}
                    isPurchase={isPurchase}
                    setIsPurchase={setIsPurchase}
                    purchase={purchase}
                    fulfilled={isFulfilled}
                    insertDate={insertDate}
                    setInsertDate={setInsertDate}
                    createPurchase={createPurchase}
                    getPurchase={getPurchase}
                    updatePurchase={updateCurrentPurchase}
                    onPurchase={handlePurchaseClick}
                    averageExchange={averageExchange}
                    allAmount={allAmount}
                    setAllAmount={setAllAmount}
                    setAverageExchange={setAverageExchange}
                    onEditPurchase={handleEditPurchaseClick}
                    onDeletePurchase={handleDeletePurchaseClick}
                    onClose={closeAllPopups}
                    isOpenPurchase={isPurchasePopupOpen}
                    isOpenEditPurchase={isEditPurchasePopupOpen}
                    isOpenDeletePurchase={isDeletePurchasePopupOpen}
                    onSubmit={handleAddDeal}
                    editExchange={editExchange}
                    setEditExchange={setEditExchange}
                    editAmount={editAmount}
                    setEditAmount={setEditAmount}
                    userUpdatePurchase={userUpdatePurchase}
                  />}
                />
                <Route path="/rate" exact element={
                  <Rate
                    currentDate={currentDate}
                    purchases={purchases}
                    insertDate={insertDate}
                    purchaseFind={purchaseFind}
                    getOnePurchase={getOnePurchase}
                    setInsertDate={setInsertDate}
                    getDatePurchase={getDatePurchase}
                    onClose={closeAllPopups}
                    onNumber={handleNumberClick}
                    isNumberPopupOpen={isNumberPopupOpen}
                  />} />
                <Route path="/payments" element={
                  <Payments
                    createPayment={createPayment}
                    isPaymentPopupOpen={isPaymentPopupOpen}
                    onClose={closeAllPopups}
                    onPaymentPopup={handlePaymentClick}
                    currentDate={currentDate}
                    payments={payments}
                    getDatePayment={getDatePayment}
                  />}
                />
                <Route path="*" exact element={<Main
                  dateDeals={dateDeals}
                  currentDate={currentDate}
                  onDealDate={getDateDeal}
                  getOneDeal={getOneDeal}
                  isPurchase={isPurchase}
                  setIsPurchase={setIsPurchase}
                  purchase={purchase}
                  fulfilled={isFulfilled}
                  insertDate={insertDate}
                  setInsertDate={setInsertDate}
                  createPurchase={createPurchase}
                  getPurchase={getPurchase}
                  updatePurchase={updateCurrentPurchase}
                  onPurchase={handlePurchaseClick}
                  averageExchange={averageExchange}
                  allAmount={allAmount}
                  setAllAmount={setAllAmount}
                  setAverageExchange={setAverageExchange}
                  onEditPurchase={handleEditPurchaseClick}
                  onDeletePurchase={handleDeletePurchaseClick}
                  onClose={closeAllPopups}
                  isOpenPurchase={isPurchasePopupOpen}
                  isOpenEditPurchase={isEditPurchasePopupOpen}
                  isOpenDeletePurchase={isDeletePurchasePopupOpen}
                  onSubmit={handleAddDeal}
                  editExchange={editExchange}
                  setEditExchange={setEditExchange}
                  editAmount={editAmount}
                  setEditAmount={setEditAmount}
                  userUpdatePurchase={userUpdatePurchase}
                />} />
              </Routes>
            </main>
            <footer className="footer">
              <p className="footer__copyright">&copy; 2023. P2P-helper</p>
            </footer>
          </div>
          <div className={`popup_fee ${isFeePopupOpen ? 'popup_opened' : ''}`}>
            <div className="popup__container">
              <button className="popup__close-icon" type="button" onClick={closeAllPopups} />
              <form className="popup__form" name="popup__form" noValidate="" onSubmit={handleFeeSubmit}>
                <button className="popup__close-icon" type="button" onClick={closeAllPopups} />
                <h2 className="popup__title">Введите данные!</h2>
                <input
                  className="popup__field"
                  type="number"
                  placeholder="Комиссия сети"
                  name="exchange"
                  value={network}
                  onChange={handleChangeNetwork}
                  required
                  minLength={2}
                  maxLength={40}
                />
                <span className="popup__span popup__span_name">Комиссия сети</span>
                <input
                  className="popup__field"
                  type="number"
                  placeholder="Комиссия площадки"
                  name="amount"
                  value={site}
                  onChange={handleChangeSite}
                  required
                  minLength={2}
                  maxLength={200}
                />
                <span className="popup__span popup__span_name">Комиссия площадки</span>
                <button className="popup__submit" type="submit" name="form__submit">Внести данные</button>
              </form>
            </div>
          </div>
          <div className={`popup_bitconce ${isTokenPopupOpen ? 'popup_opened' : ''}`}>
            <div className="popup__container">
              <form className="popup__form" name="popup__form" noValidate="" onSubmit={handleTokenSubmit}>
                <button className="popup__close-icon" type="button" onClick={closeAllPopups} />
                <h2 className="popup__title">Введите данные!</h2>
                {bitconceTokens.length ? bitconceTokens.map((item, index) => {
                  return <>
                    <input
                      id={index}
                      className="popup__field popup__field_type_occupation"
                      type="text"
                      name="token"
                      value={tokensBitconce[index]}
                      onChange={handleChangeTokens}
                      required
                      minLength={2}
                      maxLength={40}
                    />
                    <span className="popup__span popup__span_name">Токен {index + 1}</span>
                  </>
                }) : null}
                <button className="popup__submit" type="submit" name="form__submit">Внести данные</button>
              </form>
            </div>
          </div>
        </div>
      </>
    )
  }
  else {
    return (
      <>
        <div className="page">
          <Routes>
            <Route path="*" exact element={
              <AuthPage
                onSubmit={getUserInfo}
                setOpen={setIsAuthPageOpen}
                onClose={closeAllPopups}
                isOpen={isAuthPageOpen} />}
            />
          </Routes>
        </div>
      </>
    )
  }
}

export default App;