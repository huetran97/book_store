import { ShippingCost } from '@private/models';
import Validate from '../../../helpers/validate';
import * as Joi from 'joi';
import * as _ from 'lodash';
import Exception from '../../../exeptions/Exception';
import ExceptionCode from '../../../exeptions/ExceptionCode';

export default {
    Mutation: {
        addShippingCost: async (root, {  fromKM, toKM , cost}) => {
            if(toKM<fromKM)
                throw new Exception('toKM must be larger than fromKM', ExceptionCode.TOKM_MUST_BE_LARGER_THAN_FROMKM);

            let shipping_cost_data = new ShippingCost({
                fromKM: fromKM,
                toKM: toKM,
                cost: cost
            });
            return await shipping_cost_data.save();
        },
        updateShippingCost: async (root, { id, fromKM, toKM , cost, is_active }) => {
            let update: any = {};

            let shippingCost = await ShippingCost.findOne({_id: id});
            if(!shippingCost)
                throw new Exception('Shipping cost not found', ExceptionCode.SHIPPING_COST_NOT_FOUND);

            if(!fromKM)
                fromKM = shippingCost.fromKM;

            if(!toKM)
                toKM = shippingCost.toKM;

            if(toKM < fromKM)
                throw new Exception('toKM must be larger than fromKM', ExceptionCode.TOKM_MUST_BE_LARGER_THAN_FROMKM);

            if (fromKM)
                update.fromKM = fromKM;

            if(toKM)
                update.toKM= toKM;


            if (cost)
                update.cost = cost;

            if (_.isBoolean(is_active))
                update.is_active = is_active;

            let shipping_cost_updated = await ShippingCost.findOneAndUpdate({ _id: id }, { $set: update }, { new: true });

            if (!shipping_cost_updated)
                throw new Exception('Can not updated Shipping Cost', ExceptionCode.CAN_NOT_UPDATE_SHIPPING_COST);

            return shipping_cost_updated;
        },

        removeShippingCost: async (root, { id }) => {
            let shipping_cost_removed = await ShippingCost.findByIdAndRemove({ _id: id, is_active: true });

            if (!shipping_cost_removed)
                throw new Exception('Can not remove Shipping Cost',ExceptionCode.CAN_NOT_REMOVE_SHIPPING_COST );

            return {
                message: 'Remove Shipping Cost successful'
            };
        }
    },
    Query: {
        shippingCost: async (root, { id }) => {
            let shipping_cost = await ShippingCost.findOne({ _id: id });
            if(!shipping_cost)
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