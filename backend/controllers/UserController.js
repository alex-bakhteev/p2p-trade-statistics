import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

import UserModel from '../models/User.js';

export const register = async (req, res) => {
    try {

        const password = req.body.password;
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);

        const doc = UserModel({
            email: req.body.email,
            fullName: req.body.fullName,
            passwordHash: hash,
            tokenBitconce: req.body.token,
            network: req.body.network,
            site: req.body.site,
            currentPurchase: req.body.purchaseID,
        });

        const user = await doc.save();

        const token = jwt.sign({
            _id: user._id
        }, 'secret123', { expiresIn: '30d' });

        const { passwordHash, ...userData } = user._doc;

        res.json({ ...userData, token });
    }
    catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Не удалось зарегистрироваться!',
        });
    }
};

export const login = async (req, res) => {
    try {
        const user = await UserModel.findOne({ email: req.body.email });

        if (!user) {
            return res.status(404).json({
                message: 'Пользователь не найден!',
            });
        }
        else {
            const isValidPass = await bcrypt.compare(req.body.password, user._doc.passwordHash);

            if (!isValidPass) {
                return res.status(403).json({
                    message: 'Неверный логин или пароль!',
                });
            }
            else {
                const token = jwt.sign({
                    _id: user._id
                }, 'secret123', { expiresIn: '30d' });

                const { passwordHash, ...userData } = user._doc;

                res.json({ ...userData, token });
            }
        }
    }
    catch (err) {
        console.log(err);
        res.status(404).json({
            message: 'Не удалось авторизоваться!',
        });
    }
};

export const getMe = async (req, res) => {
    try {
        const user = await UserModel.findById(req.body.id);
        res.json(user);
    }
    catch (err) {
        console.log(err);
    }
};

export const updateFee = async (req, res) => {
    try {
        await UserModel.updateOne({ _id: req.body.id },
            {
                network: req.body.network,
                site: req.body.site,
            });
    } catch (err) {
        console.log(err);
    }
}

export const updateToken = async (req, res) => {
    try {
        await UserModel.updateOne({ _id: req.body.id },
            {
                tokenBitconce: req.body.tokenBitconce
            });
    } catch (err) {
        console.log(err);
    }
}

export const updatePurchase = async (req, res) => {
    try {
        await UserModel.updateOne({ _id: req.body.id },
            {
                currentPurchase: req.body.currentPurchase
            });
    } catch (err) {
        console.log(err);
    }
}