import { Book, Event, Promotion } from '@private/models';
import Validate from '../../../helpers/validate';
import * as Joi from 'joi';

export default {
    Query: {
        promotion: async (root, { id }) => {
            return await Promotion.findOne({ _id: id });
        },
        promotions: async (root, args) => {
            args            = new Validate(args)
                .joi({
                    offset: Joi.number().integer().optional().min(0),
                    limit: Joi.number().integer().optional().min(5)
                }).validate();
            let filter: any = {};

            if (args.event)
                filter.event = args.event;

            if (args.book)
                filter.book = args.book;

            let list = Promotion.find(filter);


            if (args.offset)
                list.skip(args.offset);
            if (args.limit)
                list.skip(args.limit);

            return {
                list_promotion: await list,
                args
            };
        }
    },
    ListPromotion: {
        total_promotion: async ({ args }) => {
            let filter: any = {};
            if (args) {
                if (args.event)
                    filter.event = args.event;

                if (args.book)
                    filter.book = args.book;
            }


            return await Promotion.find(filter).countDocuments();
        }
    },
    Promotion: {
        book: async (promotion) => {
            console.log('book', promotion);
            return await Book.findOne({ _id: promotion.book });
        },
        event: async (promotion) => {
            return await Event.findOne({ _id: promotion.event });
        },
        begin_date: async (promotion) => {
            let event = await Event.findOne({ _id: promotion.event });
            return event.begin_time;
        },
        end_date: async (promotion) => {
            let event = await Event.findOne({ _id: promotion.event });
            return event.end_time;
        }
    }
};