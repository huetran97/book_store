import { DomainKnowledge, Subject } from '@private/models';
import Validate from '../../../helpers/validate';
import * as Joi from 'joi';

export default {

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

            let filter: any = { is_active: true };

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
            let filter: any = { is_active: true };
            if (args) {

                if (args.domain_knowledge) {
                    filter.domain_knowledge = args.domain_knowledge;
                }

            }


            return await Subject.find(filter).countDocuments();
        }
    },
    Subject: {
        domain_knowledge: async (subject) => {
            return await DomainKnowledge.findOne({ _id: subject.domain_knowledge, is_active: true });
        }
    }
};