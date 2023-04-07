import axios from 'axios';

import OrderModel from '../models/Order.js';

export const getAll = async (req, res) => {
    try {
        const currentOrdersBitconce = await axios({
            method: 'get',
            url: 'https://bitconce.com/api/getOrders/',
            data: {
                status: 'Finished',
                amount: 3,
                page_number: 1,
            },
            headers: {
                'Authorization': `Bearer ${req.body.token}`
            },

        })
            .then((res) => {
                if (res.data !== undefined) {
                    return res.data.orders;
                }
            })
            .catch((err) => {
                console.log(err);
            });
        const checkOrders = await OrderModel.find({ token: req.body.token });

        if (currentOrdersBitconce !== undefined) {
            for (let i = 0; currentOrdersBitconce.length > i; i++) {
                if (!(checkOrders.some((item) => item.id === currentOrdersBitconce[i].id))) {
                    const doc = new OrderModel({
                        id: currentOrdersBitconce[i].id,
                        exchange: currentOrdersBitconce[i].curse,
                        received: currentOrdersBitconce[i].fiat_amount,
                        usdt: currentOrdersBitconce[i].usdt_amount,
                        date: currentOrdersBitconce[i].created_at,
                        token: req.body.token,
                    });
                    await doc.save();
                }
            }
        }

        const orders = await OrderModel.find({ token: req.body.token });
        res.json(orders);
    } catch (err) {
        console.log(err);
    }
};

export const updateAll = async (req, res) => {
    try {
        await OrderModel.updateMany({ token: req.body.token }, { token: req.body.newToken });
    } catch (err) {
        console.log(err);
    }
};

export const getOne = async (req, res) => {
    try {
        const postId = req.params.id;

        PostModel.findOneAndUpdate({
            _id: postId,
        },
            { $inc: { viewsCount: 1 } },
            { returnDocument: 'after' },
        ).then((doc) => {
            if (!doc) {
                return res.status(404).json({ message: 'Статья не найдена!', });
            }
            else {
                res.json(doc);
            }
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Не удалось получить статьи!',
        });
    }
};

export const remove = async (req, res) => {
    try {
        const postId = req.params.id;

        PostModel.findOneAndDelete({
            _id: postId,
        }).then((doc) => {
            if (!doc) {
                return res.status(404).json({ message: 'Статья не найдена!', });
            }
            else {
                res.json({
                    message: 'Статья удалена!'
                });
            }
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Не удалось получить статьи!',
        });
    }
};

export const create = async (req, res) => {
    try {
        const doc = new OrderModel({
            id: req.body.id,
            exchange: req.body.exchange,
            received: req.body.received,
            usdt: req.body.usdt,
            date: req.body.date,
            token: req.body.token,
        });

        const currentOrder = await doc.save();

    } catch (err) {
        console.log(err);
    }
};