import { Store } from '@private/models';
import Exception from '../../../exeptions/Exception';
import ExceptionCode from '../../../exeptions/ExceptionCode';

export default {
    Query: {
        distance: async (root, { store, address }) => {
            let latitude, longitude;
            let store_data = await Store.findOne({ _id: store });
            if (!store_data)
                throw new Exception('Store not found', ExceptionCode.STORE_NOT_FOUND);

            // let geocoding_data = await service.geocodingApi.getGeocodingData(address);
            // if (geocoding_data.status === 'OK') {
            //     latitude  = geocoding_data.results[0].geometry.location.lat;
            //     longitude = geocoding_data.results[0].geometry.location.lng;
            // }else {
            //     throw new Exception('')
        }
        // let  point1 = new GeoPoint(lat1, long1);
        // let  point2 = new GeoPoint(lat2, long2);
        //  let distance = point1.distanceTo(point2, true)//outpu

        // }
        }
    }