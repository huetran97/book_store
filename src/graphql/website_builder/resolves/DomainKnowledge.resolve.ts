import { DomainKnowledge, Language, Subject } from '@private/models';
import Validate from '../../../helpers/validate';
import * as Joi from 'joi';
import * as _ from 'lodash';
import Exception from '../../../exeptions/Exception';
import ExceptionCode from '../../../exeptions/ExceptionCode';

export default {

    Query: {
        domainKnowledge: async (root, { id }) => {
            console.log('vao roi');
            let domain_knowledge_data = await DomainKnowledge.findOne({ _id: id });
            if (!domain_knowledge_data)
                throw new Exception('Domain knowledge not found', ExceptionCode.DOMAIN_KNOWLEDGE_NOT_FOUND);

            return domain_knowledge_data;
        },
        domainKnowledges: async (root, args) => {
            args = new Validate(args)
                .joi({
                    offset: Joi.number().integer().optional().min(0).default(0),
                    limit: Joi.number().integer().optional().min(5).default(100)
                }).validate();

            let filter: any = { $or:[
                    { is_active: true },
                    {is_active: null}
                ]};

            if (args.language)
                filter.language = args.language;

            let list = DomainKnowledge
                .find(filter)
                .skip(args.offset)
                .limit(args.limit);

            return {
                list_domain_knowledge: await list,
                args
            };
        }
    },
    ListDomainKnowledge: {
        total_domain_knowledge: async ({ args }) => {
            console.log('args', args);
            let filter: any = {};

            if (args.language)
                filter.language = args.language;

            return await DomainKnowledge.find(filter).countDocuments();
        }
    },
    DomainKnowledge: {
        language: async (domain_knowledge) => {
            return await Language.findOne({ _id: domain_knowledge.language });
        },
        subjects: async (list_domain_knowledge, args) => {

            let filter: any = { domain_knowledge: list_domain_knowledge, is_active:true };

            return await Subject.find(filter);
        }
    }
};