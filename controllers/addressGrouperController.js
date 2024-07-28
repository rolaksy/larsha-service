const BaseController = require('./baseController');
const AddressGrouper = require('../services/addressGrouper');

class AddressGrouperController extends BaseController{
    constructor(request, response) {
        super(request, response);
        this.payload = request.body;
        this.addressService = new AddressGrouper();
        this.init();
    }

    init() {
        this.addresses = this.utils.isEmpty(this.payload.addresses) ? "" : this.payload.addresses;
    }
    
    async groupAddresses () {
        try {
            const addressGroups = await this.addressService.groupAddressesByRegion(this.addresses);
            return this.response.success(addressGroups);
        } catch (error) {
            return this.response.error(error.message || 'An error occurred while grouping addresses');
        }
    }
}


module.exports = AddressGrouperController;
