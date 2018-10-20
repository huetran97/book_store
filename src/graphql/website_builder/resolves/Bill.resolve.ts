import { Bill, BookStore, Cart, Promotion, ShippingCost, User , Book} from '@private/models';
import Exception from '../../../exeptions/Exception';
import ExceptionCode from '../../../exeptions/ExceptionCode';
import * as Joi from 'joi';
import Validate from '../../../helpers/validate';
import { changeAlias } from '../../../helpers/index';
import * as  escapeStringRegexp from 'escape-string-regexp';


export default {
    Query: {
        bill: async (root, { id }) => {
            let bill_data = await Bill.findOne({ _id: id });
            if (!bill_data)
                throw new Exception('Bill not found', ExceptionCode.BILL_NOT_FOUND);
            return bill_data;

        },
        bills: async (root, args) => {
            args = new Validate(args)
                .joi({
                    offset: Joi.number().integer().optional().min(0).default(0),
                    limit: Joi.number().integer().optional().min(5).default(20)
                }).validate();

            let filter: any = {};


            if (args.search) {
                let user_id = await User.find({
                    $or: [
                        { name_slug: new RegExp(escapeStringRegexp(changeAlias(args.search)), 'gi') },
                        { phone_number: args.search }
                    ]
                }).distinct('_id');
                filter.$or  = [
                    { staff: { $in: { user_id } } },
                    { _id: args.search }
                ];
            }


            let list = Bill
                .find(filter)
                .skip(args.offset)
                .limit(args.limit);

            return {
                list_bill: await list,
                args
            };
        }

    },
    Mutation: {
        addBill: async (root, { carts, shipping, shipping_address }, { user }) => {
            let cartID   = [];
            let sum      = 0;
            let discount = 0;

            for (let cart of carts) {
                if (cart.promotion) {
                    let promotion_data = await Promotion.findOne({ _id: cart.promotion });
                    if (!promotion_data)
                        throw new Exception('Promotion not found', ExceptionCode.PROMOTION_NOT_FOUND);
                    discount = promotion_data.discount;
                }


                let book_store_data: any = await BookStore.findOne({ _id: cart.book_store,
                    quantity_sold: {$lte: '$amount'}}).populate('book');


                if (!book_store_data)
                    throw new Exception('Book store not found', ExceptionCode.BOOK_STORE_NOT_FOUND);

                let bookData = await Book.findOne({_id: book_store_data.book});

                let newCart = new Cart({
                    user: user._id,
                    book: book_store_data.book,
                    promotion: cart.promotion,
                    number: cart.number,
                    price: book_store_data.book.price
                });
                await newCart.save();

                book_store_data.quantity_sold +=1;


                sum += (book_store_data.book.price * cart.number) - (cart.number * discount * book_store_data.book.price);

                cartID.push(newCart._id);
            }

            let shippingData = await ShippingCost.findOne({ _id: shipping });
            if (!shippingData)
                throw new Exception('Shipping not found', ExceptionCode.SHIPPING_COST_NOT_FOUND);
            let newBill = new Bill({
                user: user._id,
                cart: cartID,
                status: Bill.PENDING,
                shipping: shipping,
                shipping_address: shipping_address,
                total_amount: sum
            });

            return await newBill.save();

        }
    },
    Bill: {
        user: async (bill) => {
            return await User.findOne({ _id: bill.user });
        },
        cart: async (bill) => {
            return await Cart.find({ _id: { $in: bill.cart } });
        },
        shipping: async (bill) => {
            return await ShippingCost.findOne({ _id: bill.shipping });
        }
    }
};