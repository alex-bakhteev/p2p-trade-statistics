import PaymentModel from '../models/Payment.js';

export const getSortDate = async (req, res) => {
    try {
        const payments = await PaymentModel.find({ date: req.body.date, token: req.body.token });
        res.json(payments);
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
        await PaymentModel.updateMany({ token: req.body.token }, { token: req.body.newToken });
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
        const doc = new PaymentModel({
            id: req.body.id,
            amount: req.body.amount,
            comment: req.body.comment,
            date: req.body.date,
            allDate: req.body.allDate,
            token: req.body.token,
        });

        const currentDeal = await doc.save();

    } catch (err) {
        console.log(err);
        res.status(404).json();
    }
};