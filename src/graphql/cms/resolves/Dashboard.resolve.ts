import { Book, BookStore, Cart, Store } from '@private/models';
import { ObjectID } from 'bson';
import moment = require('moment-timezone');
import * as _ from 'lodash';

export default {
    Query: {
        goodsSale: async (root, { from_date, to_date }) => {
            if (!from_date)
                from_date = moment().startOf('month').format('YYYYMMDD');

            if (!to_date)
                to_date = moment().add(1, 'day').format('YYYYMMDD');

            return {
                from_date: from_date,
                to_date: to_date
            };
        },
        costOfGoodsSold: async (root, { from_date, to_date }) => {
            if (!from_date)
                from_date = moment().startOf('month').format('YYYYMMDD');

            if (!to_date)
                to_date = moment().add(1, 'day').format('YYYYMMDD');

            return {
                from_date: from_date,
                to_date: to_date
            };
        },
        grossProfit: async (root, { from_date, to_date }) => {
            if (!from_date)
                from_date = moment().startOf('month').format('YYYYMMDD');

            if (!to_date)
                to_date = moment().add(1, 'day').format('YYYYMMDD');

            return {
                from_date: from_date,
                to_date: to_date
            };
        }
    },
    GoodsSale: {
        total: async ({ from_date, to_date }) => {
            let total = 0;
            let cart_data = await Cart.aggregate(
                [
                    {
                        $match: {
                            created_at: {
                                $gte: moment(from_date, 'YYYYMMDD').toDate(),
                                $lte: moment(to_date, 'YYYYMMDD').toDate()
                            }                        }
                    },
                    {
                        $project: {
                            total: { $multiply: ['$number', '$price'] }

                        }

                    },
                    {
                        $group: {
                            _id: '',
                            amount: { $sum: '$total' }
                        }
                    }

                ]
            );

            if (cart_data.length > 0)
                total = cart_data[0].amount;

            return total;
        },
        data: async ({ from_date, to_date }) => {
            let store_data = await Store.find({
                $or: [
                    { is_active: true },
                    { is_active: null }
                ]
            });
            let data       = [];
            for (let store of store_data) {
                let item: any = {};
                item.store    = store;
                let total     = 0;

                let cart_data = await Cart.aggregate(
                    [
                        {
                            $match: {
                                created_at: {
                                    $gte: moment(from_date, 'YYYYMMDD').toDate(),
                                    $lte: moment(to_date, 'YYYYMMDD').toDate()
                                },
                                store: new ObjectID(store._id)
                            }
                        },
                        {
                            $project: {
                                total: { $multiply: ['$number', '$price'] }

                            }

                        },
                        {
                            $group: {
                                _id: '',
                                amount: { $sum: '$total' }
                            }
                        }

                    ]
                );
                if (cart_data.length > 0)
                    total = cart_data[0].amount;

                item.goods_sale = total;
                data.push(item);
            }
            return data;
        }

    },
    CostOfGoodsSold: {
        total: async ({ from_date, to_date }) => {
            let total     = 0;
            let book_data = await Book.aggregate(
                [
                    {
                        $match: {
                            created_at: {
                                $gte: moment(from_date, 'YYYYMMDD').toDate(),
                                $lte: moment(to_date, 'YYYYMMDD').toDate()
                            }                        }
                    },
                    {
                        $project: {
                            total: { $multiply: ['$amount', '$historical_cost'] }

                        }

                    },
                    {
                        $group: {
                            _id: '',
                            cost: { $sum: '$total' }
                        }
                    }

                ]
            );
            if (book_data.length > 0)
                total = book_data[0].cost;

            return total;
        },
        data: async ({ from_date, to_date }) => {
            let store_data = await Store.find({
                $or: [
                    { is_active: true },
                    { is_active: null }
                ]
            });
            let data       = [];

            for (let store of store_data) {
                let item: any = {};
                item.store    = store;
                let total     = 0;

                let bookId = await BookStore.find({
                    created_at: {
                        $gte: moment(from_date).toDate(),
                        $lte: moment(to_date).toDate()
                    },
                    store: store._id
                }).distinct('book');

                let book_data = await Book.aggregate(
                    [
                        {
                            $match: {
                                created_at: {
                                    $gte: moment(from_date, 'YYYYMMDD').toDate(),
                                    $lte: moment(to_date, 'YYYYMMDD').toDate()
                                },
                                _id: { $in: bookId }
                            }
                        },
                        {
                            $lookup: {
                                from: 'book_store',
                                localField: '_id',
                                foreignField: 'book',
                                as: 'book_store_'
                            }
                        },
                        { $unwind: '$book_store_' },
                        {
                            $project: {
                                total: { $multiply: ['$book_store_.amount', '$historical_cost'] }

                            }

                        },
                        {
                            $group: {
                                _id: '',
                                cost: { $sum: '$total' }
                            }
                        }

                    ]
                );

                if (book_data.length > 0)
                    total = book_data[0].cost;

                item.cost_of_goods_sold = total;
                data.push(item);
            }
            return data;
        }
    },
    GrossProfit: {
        total: async ({ from_date, to_date }) => {
            let total = 0;

            let cart_data = await Cart.aggregate(
                [
                    {
                        $match: {
                            created_at: {
                                $gte: moment(from_date, 'YYYYMMDD').toDate(),
                                $lte: moment(to_date, 'YYYYMMDD').toDate()
                            }                        }
                    },
                    {
                        $lookup: {
                            from: 'book',
                            localField: 'book',
                            foreignField: '_id',
                            as: 'book_cart'
                        }
                    },
                    { $unwind: '$book_cart' },
                    {
                        $project: {
                            total: {
                                $multiply: [
                                    { $subtract: ['$book_cart.price', '$book_cart.historical_cost'] },
                                    '$number'
                                ]
                            }
                        }

                    },
                    {
                        $group: {
                            _id: '',
                            amount: { $sum: '$total' }
                        }
                    }

                ]
            );

            if (cart_data.length > 0)
                total = cart_data[0].amount;

            return total;
        },
        data: async ({ from_date, to_date }) => {
            let store_data = await Store.find({
                $or: [
                    { is_active: true },
                    { is_active: null }
                ]
            });
            let data       = [];
            for (let store of store_data) {
                let item: any = {};
                item.store    = store;
                let total     = 0;

                let cart_data = await Cart.aggregate(
                    [
                        {
                            $match: {
                                created_at: {
                                    $gte: moment(from_date, 'YYYYMMDD').toDate(),
                                    $lte: moment(to_date, 'YYYYMMDD').toDate()
                                },
                                store: new ObjectID(store._id)

                            }
                        },
                        {
                            $lookup: {
                                from: 'book',
                                localField: 'book',
                                foreignField: '_id',
                                as: 'book_cart'
                            }
                        },
                        { $unwind: '$book_cart' },
                        {
                            $project: {
                                total: {
                                    $multiply: [
                                        { $subtract: ['$book_cart.price', '$book_cart.historical_cost'] },
                                        '$number'
                                    ]
                                }
                            }

                        },
                        {
                            $group: {
                                _id: '',
                                amount: { $sum: '$total' }
                            }
                        }

                    ]
                );
                if (cart_data.length > 0)
                    total = cart_data[0].amount;

                item.gross_profit = total;
                data.push(item);
            }
            return data;
        }

    }

};