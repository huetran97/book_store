import gql from 'graphql-tag';

const dashboard = gql`

    type costOfGoodsSoldOfStore{
        store: Store,
        cost_of_goods_sold: Float,
    }
    type CostOfGoodsSold {
        total: Float,
        data: [costOfGoodsSoldOfStore],
    },
   
    type goodsSaleOfStore{
        store: Store,
        goods_sale: Float,
    }
    type GoodsSale {
        total: Float,
        data: [goodsSaleOfStore],
    },

    type grossProfitOfStore{
        store: Store,
        gross_profit: Float,
    }
    type GrossProfit {
        total: Float,
        data: [grossProfitOfStore],
    },


`;
export default dashboard;