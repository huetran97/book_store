import { Book, BookStore, Cart, Store } from '@private/models';
import { ObjectID } from 'bson';
import moment = require('moment-timezone');

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
                            created_at: { $gte: moment(from_date).toDate(), $lte: moment(to_date).toDate() }
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

            return total;
        },
        data: async ({ from_date, to_date }) => {
            let store_data = await Store.find({ is_active: true });
            let data       = [];
            for (let store of store_data) {
                let item: any = {};
                item.store    = store;
                let total     = 0;

                let cart_data = await Cart.aggregate(
                    [
                        {
                            $match: {
                                created_at: { $gte: moment(from_date).toDate(), $lte: moment(to_date).toDate() },
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
                            created_at: { $gte: moment(from_date).toDate(), $lte: moment(to_date).toDate() }
                        }
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
            let store_data = await Store.find({ is_active: true });
            let data       = [];
            for (let store of store_data) {
                let item: any = {};
                item.store    = store;
                let total     = 0;

                let bookId = await BookStore.find({
                    created_at: {
                        $gte: moment(from_date).toDate(),
                        $lte: moment(to_date).toDate()
                    }
                }).distinct('book');

                let book_data = await Book.aggregate(
                    [
                        {
                            $match: {
                                created_at: { $gte: moment(from_date).toDate(), $lte: moment(to_date).toDate() },
                                _id: { $in: bookId }
                            }
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
                            created_at: { $gte: moment(from_date).toDate(), $lte: moment(to_date).toDate() }
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

            return total;
        },
        data: async ({ from_date, to_date }) => {
            let store_data = await Store.find({ is_active: true });
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
                                    $gte: moment(from_date).toDate(), $lte: moment(to_date).toDate(),
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