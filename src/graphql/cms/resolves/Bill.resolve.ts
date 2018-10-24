import { Bill } from '@private/models';
import Validate from '../../../helpers/validate';
import * as Joi from 'joi';
import { BookStore, Cart, ShippingCost, Store, User } from '@private/models/index';
import * as  escapeStringRegexp from 'escape-string-regexp';
import { changeAlias } from '../../../helpers';
import Exception from '../../../exeptions/Exception';
import ExceptionCode from '../../../exeptions/ExceptionCode';

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
        updateBill: async (root, { id, status }) => {
            let bill_updated = await Bill.findOneAndUpdate({ _id: id }, { $set: { status: status } }, { new: true });
            if (!bill_updated)
                throw new Exception('Can not updated Bill', ExceptionCode.CAN_NOT_UPDATE_BILL);
            return bill_updated;

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

    },
    Cart: {
        book: async (cart) => {
            return await BookStore.findOne({ _id: cart.book });

        },
        store: async (cart) => {
            return await Store.findOne({ _id: cart.store });

        }

    }
};