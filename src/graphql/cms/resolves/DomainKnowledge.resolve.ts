import { DomainKnowledge, Language } from '@private/models';
import Validate from '../../../helpers/validate';
import * as Joi from 'joi';
import * as _ from 'lodash';
import Exception from '../../../exeptions/Exception';
import ExceptionCode from '../../../exeptions/ExceptionCode';
import { Subject } from '@private/models/index';

export default {
    Mutation: {
        addDomainKnowledge: async (root, { name, language }) => {
            let domain_data_exist = await Subject.findOne({
                name: name, language: language
            });

            if (domain_data_exist)
                throw new Exception('Domain is exist in language', ExceptionCode.DOMAIN_IS_EXIST_IN_LANGUAGE);


            let domain_knowledge = new DomainKnowledge({
                name: name,
                language: language
            });
            return await domain_knowledge.save();
        },
        updateDomainKnowledge: async (root, { id, name, is_active, language }) => {
            let domain_data = await DomainKnowledge.findOne({ _id: id });
            if (!domain_data)
                throw new Exception('Domain knowledge not found', ExceptionCode.DOMAIN_KNOWLEDGE_NOT_FOUND);

            if (name) {
                let domain_knowledge_exist = await DomainKnowledge.findOne({
                    name: name, language: domain_data.language
                });

                if (domain_knowledge_exist)
                    throw new Exception('Domain knowledge is exist in language', ExceptionCode.DOMAIN_IS_EXIST_IN_LANGUAGE);

                domain_data.name = name;
            }


            if (language) {

                let language_data = await Language.findOne({ _id: language });
                if (!language_data)
                    throw new Error('Language not found');

                let domain_knowledge_exist = await DomainKnowledge.findOne({
                    name: domain_data.name, language: language
                });

                if (domain_knowledge_exist)
                    throw new Exception('Domain knowledge is exist in language', ExceptionCode.DOMAIN_IS_EXIST_IN_LANGUAGE);

                domain_data.language = language;
            }

            if (_.isBoolean(is_active))
                domain_data.is_active = is_active;

            return await domain_data.save();
        },

        removeDomainKnowledge: async (root, { id }) => {
            let domain_knowLedge_removed = await DomainKnowledge.findOneAndUpdate({
                _id: id,
                $or:[
                    { is_active: true },
                    {is_active: null}
                ]            }, { $set: { is_active: false } }, { new: true });

            if (!domain_knowLedge_removed)
                throw new Error('Can not remove Domain Knowledge');

            return {
                message: 'Remove Domain Knowledge successful'
            };
        }
    },
    Query: {
        domainKnowledge: async (root, { id }) => {
            let domain_knowledge_data = await DomainKnowledge.findOne({ _id: id });
            if (!domain_knowledge_data)
                throw new Exception('Domain knowledge not found', ExceptionCode.DOMAIN_KNOWLEDGE_NOT_FOUND);

            return domain_knowledge_data;
        },
        domainKnowledges: async (root, args) => {
            args = new Validate(args)
                .joi({
                    offset: Joi.number().integer().optional().min(0),
                    limit: Joi.number().integer().optional().min(5)
                }).validate();

            let filter: any = {};
            if (args.language) {
                filter.language = args.language;
            }

            if (_.isBoolean(args.is_active)) {
                filter.is_active = args.is_active;
            }

            let list = DomainKnowledge
                .find(filter)

            if (args.offset)
                list.skip(args.offset);
            if (args.limit)
                list.skip(args.limit);

            return {
                list_domain_knowledge: await list,
                args
            };
        }
    },
    ListDomainKnowledge: {
        total_domain_knowledge: async ({ args }) => {
            let filter: any = {};

            if (args) {
                if (args.language)
                    filter.language = args.language;

                if (_.isBoolean(args.is_active))
                    filter.is_active = args.is_active;

            }

            return await DomainKnowledge.find(filter).countDocuments();
        }
    },
    DomainKnowledge: {
        language: async (domain_knowledge) => {
            return await Language.findOne({ _id: domain_knowledge.language });
        }
    }
};