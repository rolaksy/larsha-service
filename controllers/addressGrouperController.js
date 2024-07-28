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
        console.log(this.addresses);
        const addressGroups = await this.addressService.groupAddressesByRegion(this.addresses);
        console.log(addressGroups);
        return this.response.success("OK");
    }
}


module.exports = AddressGrouperController;
