import { ShippingCost } from '@private/models';
import Validate from '../../../helpers/validate';
import * as Joi from 'joi';
import * as _ from 'lodash';
import Exception from '../../../exeptions/Exception';
import ExceptionCode from '../../../exeptions/ExceptionCode';

export default {
    Query: {
        shippingCost: async (root, { id }) => {
            let shipping_cost = await ShippingCost.findOne({ _id: id });
            if (!shipping_cost)
                throw new Exception('Shipping cost not found', ExceptionCode.SHIPPING_COST_NOT_FOUND);

            return shipping_cost;
        },
        shippingCosts: async (root, args) => {
            args = new Validate(args)
                .joi({
                    offset: Joi.number().integer().optional().min(0).default(0),
                    limit: Joi.number().integer().optional().min(5).default(20)
                }).validate();

            let filter: any = {};

            if (_.isBoolean(args.is_active)) {
                filter.is_active = args.is_active;
            }

            let list = ShippingCost
                .find(filter)
                .skip(args.offset)
                .limit(args.limit);

            return {
                list_shipping_cost: await list,
                args
            };
        }
    },
    ListShippingCost: {
        total_shipping_cost: async ({ args }) => {
            let filter: any = {};

            if (_.isBoolean(args.is_active)) {
                filter.is_active = args.is_active;
            }

            return await ShippingCost.find(filter).countDocuments();
        }
    }

};