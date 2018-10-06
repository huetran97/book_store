import { Publisher } from '@private/models';
import { changeAlias } from '../../../helpers';
import Validate from '../../../helpers/validate';
import * as Joi from 'joi';
import * as _ from 'lodash';
import * as  escapeStringRegexp from 'escape-string-regexp';
import Exception from '../../../exeptions/Exception';
import ExceptionCode from '../../../exeptions/ExceptionCode';

export default {

    Query: {
        publisher: async (root, { id }) => {
            let pushlisher = await Publisher.findOne({ _id: id });
            if (!pushlisher)
                throw new Exception('Publisher not found', ExceptionCode.PUBLISHER_NOT_FOUND);
            return pushlisher;
        },
        publishers: async (root, args) => {
            args = new Validate(args)
                .joi({
                    offset: Joi.number().integer().optional().min(0).default(0),
                    limit: Joi.number().integer().optional().min(5).default(20)
                }).validate();

            let filter: any = {};


            if (args.search) {
                filter.$or = [
                    { name_slug: new RegExp(escapeStringRegexp(changeAlias(args.search)), 'gi') }
                ];
            }

            if (_.isBoolean(args.is_active)) {
                filter.is_active = args.is_active;
            }

            let list = Publisher
                .find(filter)
                .skip(args.offset)
                .limit(args.limit);

            return {
                list_publisher: await list,
                args
            };
        }
    },
    ListPublisher: {
        total_publisher: async ({ args }) => {
            let filter: any = {};

            if (args.search) {
                filter.$or = [
                    { name_slug: new RegExp(escapeStringRegexp(changeAlias(args.search)), 'gi') }
                ];
            }

            if (_.isBoolean(args.is_active)) {
                filter.is_active = args.is_active;
            }

            return await Publisher.find(filter).countDocuments();
        }
    }
};