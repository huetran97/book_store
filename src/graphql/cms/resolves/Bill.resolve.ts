import { Bill } from '@private/models';
import Validate from '../../../helpers/validate';
import * as Joi from 'joi';
import { User } from '@private/models/index';
import { escapeStringRegexp } from 'escape-string-regexp';
import { changeAlias } from '../../../helpers';

export default {
    Query: {
        bill: async (root, { id }) => {
            let bill_data = await Bill.findOne({ _id: id });
            if (!bill_data)
                throw new Error('Bill not found');

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
    }
};