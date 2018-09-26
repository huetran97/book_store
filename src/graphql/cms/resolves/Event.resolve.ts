import { Event, Promotion } from '@private/models';
import Validate from '../../../helpers/validate';
import * as Joi from 'joi';

export default {
    Mutation: {
        addEvent: async (root, { title, description, thumbnail, content, begin_time, end_time }) => {
            let event = new Event({
                title: title,
                description: description,
                thumbnail: thumbnail,
                content: content,
                begin_time: begin_time,
                end_time: end_time

            });
            return await event.save();
        },
        updateEvent: async (root, { id, title, description, thumbnail, content, begin_time, end_time }) => {
            let update: any = {};

            if (title) {
                update.title = title;
            }

            if (description)
                update.description = description;

            if (thumbnail)
                update.thumbnail = thumbnail;

            if (content)
                update.content = content;

            if (begin_time)
                update.begin_time = begin_time;

            if (end_time)
                update.end_time = end_time;

            let event_updated = await Event.findOneAndUpdate({ _id: id }, { $set: update }, { new: true });

            if (!event_updated)
                throw new Error('Can not updated Event');

            return event_updated;
        },

        removeEvent: async (root, { id }) => {
            let promotion_data = await Promotion.findOne({ event: id });

            if (promotion_data)
                throw new Error('You can not Event');

            let event_removed = await Event.findOneAndRemove({ _id: id });
            if (!event_removed)
                throw new Error('Can not remove Event');

            return {
                message: 'Remove Event successful'
            };
        }
    },
    Query: {
        event: async (root, { id }) => {
            return await Event.findOne({ _id: id });
        },
        events: async (root, args) => {
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
                list_event: await list,
                args
            };
        }
    },
    ListEvent: {
        total_event: async ({ args }) => {
            return await Event.find({}).countDocuments();
        }
    }
};