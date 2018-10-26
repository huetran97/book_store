import { Event } from '@private/models';
import Validate from '../../../helpers/validate';
import * as Joi from 'joi';
import Exception from '../../../exeptions/Exception';
import ExceptionCode from '../../../exeptions/ExceptionCode';

export default {

    Query: {
        event: async (root, { id }) => {
            let event_data = await Event.findOne({ _id: id });
            if (!event_data)
                throw new Exception('Event not found', ExceptionCode.EVENT_NOT_FOUND);

            return event_data;
        },
        events: async (root, args) => {
            args = new Validate(args)
                .joi({
                    offset: Joi.number().integer().optional().min(0).default(0),
                    limit: Joi.number().integer().optional().min(5).default(100)
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