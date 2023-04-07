import React from "react";
import { Navigate, Routes, Route, } from "react-router-dom";
import { AuthPage } from "./AuthPage";
import { Main } from "./Main";
import { Rate } from "./Rate";
import { Count } from "./Count";
import { Payments } from "./Payments";

export const Login = (isAuth) => {
    if (isAuth) {
        return (
            <Routes>
                <Route path="/main" exact element={<Main />} />
                <Route path="/rate" exact element={<Rate />} />
                <Route path="/count" element={<Count />} />
                <Route path="/payments" element={<Payments />} />
                <Route path="*" exact element={<Main />} />
            </Routes>
        )
    }
    else {
        return (
            <Routes>
                <Route path="/" exact element={<AuthPage />} />
                <Navigate to="/" />
            </Routes>
        )
    }
}