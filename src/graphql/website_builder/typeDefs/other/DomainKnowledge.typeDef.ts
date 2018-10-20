import gql from 'graphql-tag';

const domainKnowledge = gql`
    type DomainKnowledge {
        id: String,
        name: String
        language: Language,
        subjects: [Subject]
        is_active: Boolean
    },
    type ListDomainKnowledge {
        offset: Int,
        limit: Int,
        total_domain_knowledge : Int,
        list_domain_knowledge: [DomainKnowledge]
    }
`;

export default domainKnowledge;