import { BankPartner } from '@private/models';
import Exception from '../../../exeptions/Exception';
import ExceptionCode from '../../../exeptions/ExceptionCode';

export default {
    Mutation: {
        payment: async (root, { bank_partner_id, credit_card_number, account_name, amount }) => {
            let bank_partner_data = await BankPartner.findOne({ _id: bank_partner_id });
            if (!bank_partner_data)
                throw new Exception('Bank partner not found', ExceptionCode.BANK_PARTNER_NOT_FOUND);

            return {
                message: 'Your payment has been successfully completed'
            };
        }
    }
};