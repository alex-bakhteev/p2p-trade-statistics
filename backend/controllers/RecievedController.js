import RecievedModel from '../models/Recieved.js';

export const getAll = async (req, res) => {
    try {
        const deals = await RecievedModel.find({ token: req.body.token });
        res.json(deals);
    } catch (err) {
        console.log(err);
    }
};

export const getSortDate = async (req, res) => {
    try {
        const deals = await RecievedModel.find({ date: req.body.date, token: req.body.token });
        res.json(deals);
    } catch (err) {
        console.log(err);
    }
};

export const getOne = async (req, res) => {
    try {
        const deals = await RecievedModel.find({ id: req.body.id });
        res.json(deals);
    } catch (err) {
        console.log(err);
    }
};

export const updateAll = async (req, res) => {
    try {
        await RecievedModel.updateMany({ token: req.body.token }, { token: req.body.newToken });
    } catch (err) {
        console.log(err);
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
        console.log(req.body);
        for (const deal of req.body.deals) {
            const doc = new RecievedModel({
                id: deal.id,
                exchangeBuyID: deal.exchangeBuyID,
                exchangeBuy: deal.exchangeBuy,
                exchangePlatform: deal.exchangePlatform,
                received: deal.received,
                usdt: deal.usdt,
                earn: deal.earn,
                spread: deal.spread,
                date: deal.date.slice(0, -7),
                time: deal.date.slice(10, 15),
                token: deal.token,
            });
            await doc.save();
        }

        res.json({
            message: 'Удачная запись!'
        });

    } catch (err) {
        console.log(err);
    }
};