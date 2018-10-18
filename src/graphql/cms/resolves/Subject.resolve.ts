import { DomainKnowledge, Subject } from '@private/models';
import Validate from '../../../helpers/validate';
import * as Joi from 'joi';
import * as _ from 'lodash';
import Exception from '../../../exeptions/Exception';
import ExceptionCode from '../../../exeptions/ExceptionCode';

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

                if (!domain_knowledge_data) throw new Exception('Domain Knowledge not found', ExceptionCode.DOMAIN_KNOWLEDGE_NOT_FOUND);

                update.domain_knowledge = domain_knowledge;
            }

            if (_.isBoolean(is_active))
                update.is_active = is_active;

            let subject_updated = await Subject.findOneAndUpdate({ _id: id }, { $set: update }, { new: true });

            if (!subject_updated)
                throw new Exception('Can not updated Subject', ExceptionCode.CAN_NOT_UPDATE_SUBJECT);

            return subject_updated;
        },

        removeSubject: async (root, { id }) => {
            let subject_removed = await Subject.findOneAndUpdate({
                _id: id,
                is_active: true
            }, { $set: { is_active: false } }, { new: true });

            if (!subject_removed)
                throw new Exception('Can not remove Subject ', ExceptionCode.CAN_NOT_REMOVE_SUBJECT);

            return {
                message: 'Remove Subject successful'
            };
        }
    },
    Query: {
        subject: async (root, { id }) => {
            return await Subject.findOne({ _id: id });
        },
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

            if (args.domain_knowledge) {
                filter.domain_knowledge = args.domain_knowledge;
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
            if (args) {

                if (args.domain_knowledge) {
                    filter.domain_knowledge = args.domain_knowledge;
                }

                if (_.isBoolean(args.is_active)) {
                    filter.is_active = args.is_active;
                }
            }


            return await Subject.find(filter).countDocuments();
        }
    },
    Subject: {
        domain_knowledge: async (subject) => {
            return await DomainKnowledge.findOne({ _id: subject.domain_knowledge });
        }
    }
};