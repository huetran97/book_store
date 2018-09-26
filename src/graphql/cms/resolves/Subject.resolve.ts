import { DomainKnowledge, Subject , } from '@private/models';
import Validate from '../../../helpers/validate';
import * as Joi from 'joi';
import * as _ from 'lodash';

export default {
    Mutation: {
        addSubject: async (root, { name, domain_knowledge }) => {
            let subject_data = new Subject({
                name: name,
                domain_knowledge: domain_knowledge
            });
            return await subject_data.save();
        },

        updateSubject: async (root, { id, name, is_active, domain_knowledge }) => {
            let update: any = {};

            if (name) update.name = name;

            if (domain_knowledge) {
                let domain_knowledge_data = await DomainKnowledge.findOne({ _id: domain_knowledge });

                if (!domain_knowledge_data) throw new Error('Domain Knowledge not found');

                update.domain_knowledge = domain_knowledge;
            }

            if (_.isBoolean(is_active))
                update.is_active = is_active;

            let subject_updated = await Subject.findOneAndUpdate({ _id: id }, { $set: update }, { new: true });

            if (!subject_updated)
                throw new Error('Can not updated Subject');

            return subject_updated;
        },

        removeSubject: async (root, { id }) => {
            let subject_removed = await Subject.findOneAndUpdate({
                _id: id,
                is_active: true
            }, { $set: { is_active: false } }, { new: true });

            if (!subject_removed)
                throw new Error('Can not remove Subject ');

            return {
                message: 'Remove Subject successful'
            };
        }
    },
    Query: {
        subjects: async (root, args) => {
            args = new Validate(args)
                .joi({
                    offset: Joi.number().integer().optional().min(0).default(0),
                    limit: Joi.number().integer().optional().min(5).default(20)
                }).validate();

            let filter: any = {};


            if (_.isBoolean(args.is_active)) {
                filter.is_active = args.is_active;
            }

            let list = Subject
                .find(filter)
                .skip(args.offset)
                .limit(args.limit);

            return {
                list_subject: await list,
                args
            };
        }
    },
    ListSubject: {
        total_subject: async ({ args }) => {
            let filter: any = {};

            if (_.isBoolean(args.is_active)) {
                filter.is_active = args.is_active;
            }

            return await Subject.find(filter).countDocuments();
        }
    },
    Subject: {
        domain_knowledge: async (subject) => {
            return await DomainKnowledge.findOne({_id: subject.domain_knowledge});
        }
    }
};