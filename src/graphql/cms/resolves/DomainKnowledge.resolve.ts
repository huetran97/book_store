import { DomainKnowledge, Language } from '@private/models';
import Validate from '../../../helpers/validate';
import * as Joi from 'joi';
import * as _ from 'lodash';
import Exception from '../../../exeptions/Exception';
import ExceptionCode from '../../../exeptions/ExceptionCode';

export default {
    Mutation: {
        addDomainKnowledge: async (root, { name, language }) => {

            let domain_knowledge = new DomainKnowledge({
                name: name,
                language: language
            });
            return await domain_knowledge.save();
        },
        updateDomainKnowledge: async (root, { id, name, is_active, language }) => {
            let update: any = {};

            if (name) update.name = name;


            if (language) {
                let language_data = await Language.findOne({ _id: language });
                if (!language_data)
                    throw new Error('Language not found');

                update.language = language;
            }

            if (_.isBoolean(is_active))
                update.is_active = is_active;

            let domain_knowLedge_updated = await DomainKnowledge.findOneAndUpdate({ _id: id }, { $set: update }, { new: true });

            if (!domain_knowLedge_updated)
                throw new Error('Can not updated Domain Knowledge');

            return domain_knowLedge_updated;
        },

        removeDomainKnowledge: async (root, { id }) => {
            let domain_knowLedge_removed = await DomainKnowledge.findOneAndUpdate({
                _id: id,
                is_active: true
            }, { $set: { is_active: false } }, { new: true });

            if (!domain_knowLedge_removed)
                throw new Error('Can not remove Domain Knowledge');

            return {
                message: 'Remove Domain Knowledge successful'
            };
        }
    },
    Query: {
        domainKnowledge:async(root, {id})=>{
            let domain_knowledge_data = await DomainKnowledge.findOne({_id: id});
            if(!domain_knowledge_data)
                throw new Exception('Domain knowledge not found', ExceptionCode.DOMAIN_KNOWLEDGE_NOT_FOUND);

            return domain_knowledge_data;
        },
        domainKnowledges: async (root, args) => {
            args = new Validate(args)
                .joi({
                    offset: Joi.number().integer().optional().min(0).default(0),
                    limit: Joi.number().integer().optional().min(5).default(20)
                }).validate();

            let filter: any = {};


            if (_.isBoolean(args.is_active)) {
                filter.is_active = args.is_active;
            }

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
            let filter: any = {};

            if (_.isBoolean(args.is_active)) {
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