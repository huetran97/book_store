import { Author } from '@private/models';
import { changeAlias } from '../../../helpers';
import { User } from '@private/models/index';
import Validate from '../../../helpers/validate';
import * as Joi from 'joi';
import * as _ from 'lodash';
import * as  escapeStringRegexp from 'escape-string-regexp';

export default {
    Mutation: {
        addAuthor: async (root, { name, description }) => {
            let author = new Author({
                name: name,
                name_slug: changeAlias(name),
                description: description
            });
            return await author.save();
        },
        updateAuthor: async (root, { id, name, description , is_active}) => {
            let update: any = {};

            if (name) {
                update.name      = name;
                update.name_slug = changeAlias(name);
            }

            if (description)
                update.description = description;

            if (_.isBoolean(is_active))
                update.is_active = is_active;

            let authorUpdated = await Author.findOneAndUpdate({ _id: id }, { $set: update }, { new: true });

            if (!authorUpdated)
                throw new Error('Can not updated Author');

            return authorUpdated;
        },

        removeAuthor: async (root, { id }) => {
            let authorRemoved = await User.findOneAndUpdate({
                _id: id,
                is_active: true
            }, { $set: { is_active: false } }, { new: true });

            if (!authorRemoved)
                throw new Error('Can not remove Author');

            return {
                message: 'Remove author successful'
            };
        }
    },
    Query: {
        author: async (root, { id }) => {
            return await Author.findOne({ _id: id });
        },
        authors: async (root, args) => {
            args = new Validate(args)
                .joi({
                    offset: Joi.number().integer().optional().min(0).default(0),
                    limit: Joi.number().integer().optional().min(5).default(20)
                }).validate();

            let filter: any = {};


            if (args.search) {
                filter.$or = [
                    { name_slug: new RegExp(escapeStringRegexp(changeAlias(args.search)), 'gi') },
                ];
            }

            if (_.isBoolean(args.is_active)) {
                filter.is_active = args.is_active;
            }

            let list = Author
                .find(filter)
                .skip(args.offset)
                .limit(args.limit);

            return {
                list_author: await list,
                args
            };
        }
    },
    ListAuthor: {
        total_author: async ({ args }) => {
            let filter: any = {};

            if (args.search) {
                filter.$or = [
                    { name_slug: new RegExp(escapeStringRegexp(changeAlias(args.search)), 'gi') },
                ];
            }

            if (_.isBoolean(args.is_active)) {
                filter.is_active = args.is_active;
            }


            return await Author.find(filter).countDocuments();
        }
    }
};