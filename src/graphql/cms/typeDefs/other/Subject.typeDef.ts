import gql from 'graphql-tag';

const subject = gql`
    type Subject {
        id: String,
        name: String
        domain_knowledge: DomainKnowledge
    },
    type ListSubject {
        offset: Int,
        limit: Int,
        total_subject : Int,
        list_subject: [Subject]
    }
`;

export default subject;