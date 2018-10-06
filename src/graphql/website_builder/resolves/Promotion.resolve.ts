import { Book, Event, Promotion } from '@private/models';
import Validate from '../../../helpers/validate';
import * as Joi from 'joi';

export default {

    Query: {
        promotion: async (root, { id }) => {
            return await Promotion.findOne({ _id: id });
        },
        promotions: async (root, args) => {
            args = new Validate(args)
                .joi({
                    offset: Joi.number().integer().optional().min(0).default(0),
                    limit: Joi.number().integer().optional().min(5).default(20)
                }).validate();

            let list = Event
                .find({})
                .skip(args.offset)
                .limit(args.limit);

            return {
                list_promotion: await list,
                args
            };
        }
    },
    ListPromotion: {
        total_promotion: async ({ args }) => {
            return await Promotion.find({}).countDocuments();
        }
    },
    Promotion: {
        book: async (promotion) => {
            return await Book.findOne({ _id: promotion.book });
        },
        event: async (promotion) => {
            return await Event.findOne({ _id: promotion.event });
        }
    }
};