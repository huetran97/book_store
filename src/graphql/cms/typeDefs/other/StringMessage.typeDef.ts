import gql from 'graphql-tag';

const stringMessage = gql`
    type StringMessage {
        message: String
    }
`;

export default stringMessage;