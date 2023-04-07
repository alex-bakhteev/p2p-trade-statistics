import React, { useState, useEffect } from "react";
import { ReactComponent as Circle } from "../images/circle.svg";

export const AuthPage = (props) => {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const { isOpen, setOpen, onSubmit } = props;

    useEffect(() => {
        setOpen(true);
    }, []);

    function handleChangeEmail(evt) {
        setEmail(evt.target.value);
    }

    function handleChangePassword(evt) {
        setPassword(evt.target.value);
    }

    function handleSubmit(evt) {
        evt.preventDefault();
        onSubmit({ email, password });
    }

    return (
        <div className={`popup_auth ${isOpen ? 'popup_opened' : ''}`}>
            <div className="popup__container">
                <div className="tools_icon-helper">
                    <Circle className="tools_circle" />
                    P2P-Helper
                </div>
                <form className="popup__form_auth" name="popup__form" onSubmit={handleSubmit} noValidate="" >
                    <h2 className="popup__title_auth">Авторизация</h2>
                    <input
                        className="popup__field_auth popup__field_type_name"
                        type="text"
                        placeholder="Имя пользователя:"
                        name="email"
                        value={email}
                        onChange={handleChangeEmail}
                        required
                        minLength={2}
                        maxLength={40}
                    />
                    <span className="popup__span_auth popup__span_name" />
                    <input
                        className="popup__field_auth popup__field_type_occupation"
                        type="text"
                        placeholder="Пароль:"
                        name="password"
                        value={password}
                        onChange={handleChangePassword}
                        required
                        minLength={2}
                        maxLength={40}
                    />
                    <span className="popup__span_auth popup__span_about" />
                    <button className="popup__submit_auth" type="submit" name="form__submit">Войти</button>
                </form>
            </div>
        </div>
    )
};