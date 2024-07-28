const axios = require('axios');
const turf = require('@turf/turf');
const regions = require('../utils/regions');
const dotenv = require('dotenv');
dotenv.config();
const MAPBOX_API_TOKEN = process.env.MAPBOX_API_TOKEN || "pk.eyJ1Ijoicm9sYWtzeSIsImEiOiJjbHo1NXprbXQwbGtyMmxvbWdscWdqNmJyIn0.DFash0roKMn_DkI_vTHSKg";

class AddressGrouper {

    constructor() {

    }

    async groupAddressesByRegion(addresses) {
        const groupedAddresses = [];

        for (const address of addresses) {
            const { region, address: fullAddress } = await this._geocodeAddress(address);
            if (!groupedAddresses[region]) {
                groupedAddresses[region] = [];
            }
            groupedAddresses[region].push(fullAddress);
        }

        return groupedAddresses;
    }

    async _geocodeAddress(address) {
        try {
            const response = await axios.get(`https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(address)}.json`, {
                params: {
                    access_token: MAPBOX_API_TOKEN
                }
            });

            if (response.status === 200 && response.data.features.length > 0) {
                const feature = response.data.features[0];
                const coordinates = feature.geometry.coordinates;
                const region = this._determineRegion(coordinates);
                const fullAddress = feature.place_name;
                return { region, address: fullAddress };
            } else {
                console.error(`Geocoding error for address: ${address}`);
                return 'Unknown Region';
            }
        } catch (error) {
            console.error(`Error geocoding address: ${address}`, error);
            return 'Unknown Region';
        }
    }


    _determineRegion(coordinates) {
        const point = turf.point(coordinates);

        for (const regionName in regions) {
            const subRegions = regions[regionName];
            for (const subRegionName in subRegions) {
                const subRegionPolygon = subRegions[subRegionName];
                if (turf.booleanPointInPolygon(point, subRegionPolygon)) {
                    return `${subRegionName}`;
                }
            }
        }

        return 'Unknown Region';
    }
}

module.exports = AddressGrouper;