import { LightningElement, api, track } from 'lwc';
import {baseApiUrl} from "../../../resources/config.js";
import{getCookie} from '../../my/utils/utils.js'


export default class Moreitems extends LightningElement {
    loggedinuser='...loading';
    errMsg=false;
    @api set itemset(value) {
        this.dataset = [...value];
    }
    get itemset() {
        return this.dataset;
    }
    @track dataset = [];
    updateanitem = false;
    addanItem = false;
    @track itemToUpdate = {};
    itemName = '';
    imageUrl = '';
    desc = '';
    cardIdSelected = '';
    alert = false;

    //Id mock value
    FakeId = 7;
    connectedCallback() {
        //this.dataset = [...this.itemset];
        this.loggedinuser=getCookie('user-name');
    }
    removeError() {
        this.errMsg = false;
    }
    cardclicked(e) {
        let cardSelected = e.currentTarget.getAttribute('data-item');
        this.cardIdSelected = e.currentTarget.id;
        console.log(
            'cardclicked ' + this.cardIdSelected + ' | ' + cardSelected
        );
        //Update an item opens
        this.addanItem = false;
        this.updateanitem = true;
        this.itemToUpdate = this.dataset.find(
            (item) => item._id == this.cardIdSelected
        );
        console.log('item to update: ' + JSON.stringify(this.itemToUpdate));
        this.itemName = this.itemToUpdate.item;
        this.imageUrl = this.itemToUpdate.imgurl;
        this.desc = this.itemToUpdate.desc;
    }
    closepopup() {
        this.updateanitem = false;
        this.addanItem = false;
    }
    stopBubbling(e) {
        e.stopPropagation();
    }
    itemNameChanged(e) {
        this.itemName = e.target.value;
    }
    imageUrlChanged(e) {
        this.imageUrl = e.target.value;
    }
    descChanged(e) {
        this.desc = e.target.value;
    }
    saveItem() {
        console.log(
            'Save Data for Id : ' +
                this.itemToUpdate._id +
                ' Name' +
                this.itemName +
                ' Description' +
                this.desc +
                ' ImageUrl' +
                this.imageUrl
        );
        if (this.itemName === '' || this.imageUrl === '' || this.desc === '') {
            this.alert = true;
        } else {
            this.alert = false;
            this.updateanitem = false;
            this.addanItem = false;
            //this.updateItem(itemToUpdateInApiCall);
            let itemToUpdateInApiCall={...this.itemToUpdate};
            itemToUpdateInApiCall.item = this.itemName || 'Error @ 59 moreitems';
            itemToUpdateInApiCall.desc = this.desc || 'Error @ 60 moreitems';
            itemToUpdateInApiCall.imgurl = this.imageUrl || 'Error @ 61 moreitems';
            this.updateItemAPI(itemToUpdateInApiCall);
            this.dispatchToParent();
        }
    }
    updateItemAPI(itemToUpdateInApiCall) {
        console.log('UPDATE IN API ****** '+JSON.stringify(itemToUpdateInApiCall));
        let data = {
            "item": itemToUpdateInApiCall.item,
           "desc": itemToUpdateInApiCall.desc,
           "imgurl": itemToUpdateInApiCall.imgurl
         };
        fetch(baseApiUrl + '/petfood/admintask/'+itemToUpdateInApiCall._id,{
            method: 'put',mode: "cors",credentials:"include",withCredentials:true,headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        })
            .then((response) => response.json())
            .then((json) => {
                console.log('Response ' + JSON.stringify(json));
                if (json._id) {
                    console.log('Update Api successfull');
                    this.dispatchToParent();
                   
                } else {
                    console.log('Update Failed');
                    this.errMsg = json.error;
                }
            })
            .catch((error) => {
                console.log('Error in update item' + JSON.stringify(error));
                this.errMsg ='Error in update item' + JSON.stringify(error) ;
            });
    }
    deleteItemAPI(itemToDeleteInApiCall) {
        console.log('Delete IN API ****** '+JSON.stringify(itemToDeleteInApiCall));
        fetch(baseApiUrl + '/petfood/admintask/'+itemToDeleteInApiCall._id,{
            method: 'delete',mode: "cors",credentials:"include",withCredentials:true,headers: { 'Content-Type': 'application/json' }
        })
            .then((response) => response.json())
            .then((json) => {
                console.log('Response ' + JSON.stringify(json));
                if (json._id) {
                    console.log('Delete  successfull');
                    this.dispatchToParent();
                   
                } else {
                    console.log('Delete Failed');
                    this.errMsg = json.error;
                }
            })
            .catch((error) => {
                console.log('Error in delete item' + JSON.stringify(error));
                this.errMsg ='Error in delete item' + JSON.stringify(error) ;
            });
    }
    deleteItem() {
        this.updateanitem = false;
        console.log(
            'Delete Data for Id : ' + JSON.stringify(this.itemToUpdate)
        );
        this.deleteItemAPI(this.itemToUpdate);
    }
    dispatchToParent() {
        let updateItem = new CustomEvent('updateitem');
        this.dispatchEvent(updateItem);
    }

    addItem() {
        this.itemToUpdate = {
            Id: '       :Will be auto populated',
            Item: '',
            desc: '',
            buyafterday: 0,
            numberOfPack: 0,
            outOfStock: true,
            imgurl: ''
        };
        this.itemName = '';
        this.imageUrl = '';
        this.desc = '';
        this.updateanitem = true;
        this.addanItem = true;
    }
    saveAddItem() {
        if (this.itemName === '' || this.imageUrl === '' || this.desc === '') {
            this.alert = true;
        } else {
            this.updateanitem = false;
            this.addanItem = false;
            console.log(
                'Save new item Name' +
                    this.itemName +
                    ' Description' +
                    this.desc +
                    ' ImageUrl' +
                    this.imageUrl
            );

            
            this.itemToUpdate = {
                item: this.itemName,
                desc: this.desc,
                buyafterday: 0,
                numberOfPack: 0,
                outOfStock: true,
                imgurl: this.imageUrl
            };
            this.addNewItemAPI(this.itemToUpdate);
        }
    }
    addNewItemAPI(itemToAddInApiCall) {
        console.log('Add IN API ****** '+JSON.stringify(itemToAddInApiCall));
        let data = {
            "item": itemToAddInApiCall.item,
           "desc": itemToAddInApiCall.desc,
           "imgurl": itemToAddInApiCall.imgurl
         };
        fetch(baseApiUrl + '/petfood/admintask/',{
            method: 'post',mode: "cors",credentials:"include",withCredentials:true,headers: { 'Content-Type': 'application/json' },
            body:JSON.stringify(data)
        })
            .then((response) => response.json())
            .then((json) => {
                console.log('Response ' + JSON.stringify(json));
                if (json._id) {
                    console.log('Add  successfull');
                    this.dispatchToParent();
                   
                } else {
                    console.log('Adding Failed');
                    this.errMsg = json.error;
                }
            })
            .catch((error) => {
                console.log('Error in add item' + JSON.stringify(error));
                this.errMsg ='Error in add item' + JSON.stringify(error) ;
            });
    }
}
