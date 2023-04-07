import PurchaseModel from '../models/Purchase.js';

export const getPurchase = async (req, res) => {
    try {
        const purchase = await PurchaseModel.find({ _id: req.body.id });
        res.json(purchase);
    } catch (err) {
        console.log(err);
    }
};

export const checkSortDate = async (req, res) => {
    try {
        const purchases = await PurchaseModel.find({ datePurchase: req.query.datePurchase, token: req.query.token });
        res.json(purchases);
    } catch (err) {
        console.log(err);
    }
};

export const updateAll = async (req, res) => {
    try {
        await PurchaseModel.updateMany({ token: req.body.token }, { token: req.body.newToken });
    } catch (err) {
        console.log(err);
    }
};

export const updateCurrentPurchase = async (req, res) => {
    try {
        console.log(req.body);
        await PurchaseModel.updateOne({ _id: req.body.id },
            {
                exchangeBuy: req.body.exchangeBuy,
                amount: req.body.amount,
                fulfilled: req.body.fulfilled,
                averageExchange: req.body.averageExchange,
                allAmount: req.body.allAmount,
                datePurchase: req.body.datePurchase,
                allDate: req.body.allDate,
                token: req.body.token,
            });

        res.json({
            status: 200
        });
    } catch (err) {
        console.log(err);
    }
}

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
        const doc = new PurchaseModel({
            exchangeBuy: req.body.exchangeBuy,
            amount: req.body.amount,
            fulfilled: req.body.fulfilled,
            averageExchange: req.body.averageExchange,
            allAmount: req.body.allAmount,
            datePurchase: req.body.datePurchase,
            allDate: req.body.allDate,
            token: req.body.token,
        });

        res.json(doc._id);

        const currentPurchase = await doc.save();

    } catch (err) {
        console.log(err);
    }
};