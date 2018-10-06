import { Book, Event, Promotion } from '@private/models';
import Validate from '../../../helpers/validate';
import * as Joi from 'joi';
import Exception from '../../../exeptions/Exception';
import ExceptionCode from '../../../exeptions/ExceptionCode';

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
                    throw new Exception('Book not found', ExceptionCode.BOOK_NOT_FOUND);

                update.book = book;
            }

            if (event) {
                let event_data = await Event.findOne({ _id: event });
                if (!event_data)
                    throw new Exception('Event not found', ExceptionCode.EVENT_NOT_FOUND);
                update.event = event;

            }

            if(discount)
                update.discount = discount;

             let promotion_updated = await Promotion.findOneAndUpdate({ _id: id }, { $set: update }, { new: true });

            if (!promotion_updated)
                throw new Exception('Can not updated Promotion', ExceptionCode.CAN_NOT_UPDATE_PROMOTION);

            return promotion_updated;
        },

        removePromotion: async (root, { id }) => {
            let promotion_removed = await Promotion.findByIdAndRemove({ _id: id });

            if (!promotion_removed)
                throw new Exception('Can not remove Promotion', ExceptionCode.CAN_NOT_REMOVE_PROMOTION);

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