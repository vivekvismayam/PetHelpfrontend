import { LightningElement, api, track } from 'lwc';
import { baseApiUrl } from '../../../resources/config.js';
import{getCookie} from '../../my/utils/utils.js'

export default class Home extends LightningElement {
    @api set itemset(value) {
        this.dataset = [...value];
    }
    get itemset() {
        return this.dataset;
    }
    @track dataset = [];
    updateanitem = false;
    @track itemToUpdate = {};
    noofpts = 0;
    expdays = 0;
    cardIdSelected = '';
    alert = false;
    updateditemList = [];
    errMsg=false;

    connectedCallback() {
        //this.dataset = [...this.itemset];
        this.loggedinuser=getCookie('user-name');
    }
    cardclicked(e) {
        let cardSelected = e.currentTarget.getAttribute('data-item');
        this.cardIdSelected = e.currentTarget.id;
        console.log(
            'cardclicked ' + this.cardIdSelected + ' | ' + cardSelected
        );
        //Update an item opens
        this.updateanitem = true;
        this.itemToUpdate = this.dataset.find(
            (item) => item._id == this.cardIdSelected
        );
        console.log('item to update: ' + JSON.stringify(this.itemToUpdate));
        this.noofpts = this.itemToUpdate.numberOfPack;
        this.expdays = this.itemToUpdate.buyafterday;
    }
    closepopup() {
        this.updateanitem = false;
    }
    stopBubbling(e) {
        e.stopPropagation();
    }
    noofpacketsChanged(e) {
        this.noofpts = e.target.value;
    }
    expdaysChanged(e) {
        this.expdays = e.target.value;
    }
    saveStock() {
        console.log('Save pkt: ' + this.noofpts + ' Days: ' + this.expdays);
        let itemToUpdateInApiCall={...this.itemToUpdate};
        if (this.noofpts < 0 || this.expdays < 0) {
            this.alert = true;
        } else {
            this.alert = false;
            this.updateanitem = false;
            itemToUpdateInApiCall.numberOfPack=this.noofpts;
            itemToUpdateInApiCall.buyafterday=this.expdays;
            if (this.noofpts > 0 || this.expdays > 0) itemToUpdateInApiCall.outOfStock = false;
            else if (this.noofpts == 0 &&this.expdays == 0) itemToUpdateInApiCall.outOfStock = true;

            //Save and clear variables
            this.updateStockAPI(itemToUpdateInApiCall);
        }
    }
    updateStockAPI(itemToUpdateInApiCall) {
        console.log('UPDATE IN API ****** '+JSON.stringify(itemToUpdateInApiCall));
        let data = {
            'buyafterday': itemToUpdateInApiCall.buyafterday,
            'numberOfPack': itemToUpdateInApiCall.numberOfPack,
            'outOfStock': itemToUpdateInApiCall.outOfStock
        };
        fetch(baseApiUrl + '/petfood/'+itemToUpdateInApiCall._id,{
            method: 'put',mode: "cors",credentials:"include",withCredentials:true,headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        })
            .then((response) => response.json())
            .then((json) => {
                console.log('Response ' + JSON.stringify(json));
                if (json._id) {
                    console.log('Update Api successfull');
                    let updatedata = new CustomEvent('updatestock');
                    this.dispatchEvent(updatedata);
                } else {
                    console.log('Update Failed');
                    this.errMsg = json.error;
                }
            })
            .catch((error) => {
                console.log('Error in update stock' + JSON.stringify(error));
                this.errMsg ='Error in update stock' + JSON.stringify(error) ;
            });
    }
    removeError() {
        this.errMsg = false;
    }
}
