import { Book, Event, Promotion } from '@private/models';
import Validate from '../../../helpers/validate';
import * as Joi from 'joi';

export default {
    Mutation: {
        addPromotion: async (root, { book, event, discount }) => {
            let promotion = new Promotion({
                book: book,
                event: event,
                discount: discount
            });
            return await promotion.save();
        },
        updateEvent: async (root, { id, book, event, discount }) => {
            let update: any = {};

            if (book) {
                let book_data = await Book.findOne({ _id: book });
                if (!book_data)
                    throw new Error('Book not found');

                update.book = book;
            }

            if (event) {
                let event_data = await Event.findOne({ _id: event });
                if (!event_data)
                    throw new Error('Event not found');
                update.event = event;

            }

            if(discount)
                update.discount = discount;

             let promotion_updated = await Promotion.findOneAndUpdate({ _id: id }, { $set: update }, { new: true });

            if (!promotion_updated)
                throw new Error('Can not updated Promotion');

            return promotion_updated;
        },

        removePromotion: async (root, { id }) => {
            let promotion_removed = await Promotion.findByIdAndRemove({ _id: id });

            if (!promotion_removed)
                throw new Error('Can not remove Event');

            return {
                message: 'Remove Event successful'
            };
        }
    },
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