import mutation from './Mutation.typeDef';
import query from './Query.typeDef';
import Enum from './Enum.typeDef';

import Author from './other/Author.typeDef';
import Book from './other/Book.typeDef';
import CmsGroup from './other/CmsGroup.typeDef';
import Comment from './other/Comment.typeDef';
import Event from './other/Event.typeDef';
import IssuingCompany from './other/IssuingCompany.typeDef';
import Promotion from './other/Promotion.typeDef';
import Publisher from './other/Publisher.typeDef';
import Purchase from './other/Purchase.typeDef';
import ShippingCost from './other/ShippingCost.typeDef';
import Store from './other/Store.typeDef';
import User from './other/User.typeDef';
import StaffCmsGroup from './other/StaffCmsGroup.typeDef';
import UserReportBok from './other/UserReportBook.typeDef';
import StringMessage from './other/StringMessage.typeDef';
import Language from './other/Language.typeDef';
import DomainKnowledge from './other/DomainKnowledge.typeDef';
import Subject from './other/Subject.typeDef';

export default [
    mutation,
    query,
    Enum,

    Author,
    Book,
    CmsGroup,
    Comment,
    Event,
    IssuingCompany,
    Promotion,
    Publisher,
    Purchase,
    ShippingCost,
    Store,
    User,
    StaffCmsGroup,
    UserReportBok,
    StringMessage,
    Language,
    DomainKnowledge,
    Subject
];