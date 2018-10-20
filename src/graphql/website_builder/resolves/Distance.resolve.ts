import { ShippingCost, Store } from '@private/models';
import Exception from '../../../exeptions/Exception';
import ExceptionCode from '../../../exeptions/ExceptionCode';
// import service from '@private/services/index';
import { getDistanceFromLatLonInKm } from '../../../helpers/DistanceFromLatLong';

export default {
    Query: {
        distance: async (root, { store, address }) => {
            let latitude   = 21.0280, longitude = 105.8510;
            let store_data = await Store.findOne({ _id: store });
            if (!store_data)
                throw new Exception('Store not found', ExceptionCode.STORE_NOT_FOUND);

            // let geocoding_data = await service.geocodingApi.getGeocodingData(address);
            // if (geocoding_data.status === 'OK') {
            //     latitude  = geocoding_data.results[0].geometry.location.lat;
            //     longitude = geocoding_data.results[0].geometry.location.lng;
            // } else {
            //     throw new Exception('Unable to read location!', ExceptionCode.UNABLE_TO_READ_LOCATION);
            // }

            let distance = getDistanceFromLatLonInKm(store_data.latitude, store_data.longitude, latitude, longitude);

            let shippingCostData = await ShippingCost.findOne({
                fromKM: { $lte: distance },
                toKM: { $gte: distance }
            });


            if (!shippingCostData)
                throw new Exception('The shipping address you selected is not supported', ExceptionCode.THE_SHIPPING_ADRESS_ARE_NOT_SUPPORTED);

            return {
                shipping_cost: shippingCostData,
                distance: distance
            };
        }


        // }
    }
};