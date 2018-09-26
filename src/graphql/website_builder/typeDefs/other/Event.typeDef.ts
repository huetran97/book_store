import gql from 'graphql-tag';

const event = gql`
    type Event {
        id: String
        title: String
        description: String
        thumbnail: String
        content: String
        begin_time: Float
        end_time: Float
        created_at: Float
        updated_at: Float
    },
    type ListEvent {
        offset: Int,
        limit: Int,
        total_event : Int,
        list_event: [Event]
    }
`;

export default event;