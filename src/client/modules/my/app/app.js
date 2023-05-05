import { LightningElement } from 'lwc';
import {baseApiUrl} from "../../../resources/config.js";
import{deleteCookies,getCookie} from '../../my/utils/utils.js'

export default class App extends LightningElement {
    loggedIn=false;
    loggedInUser;
    homePage=false;
    updateStock=false;
    addEditItems=false;
    itemset=[];
    token='';
    connectedCallback(){
       //this.fetchDataFromApi();
      this.loginStatus(null);
    }
    
    refreshdata(){
        this.fetchDataFromApi();
    }
    loginStatus(e){
        //console.log('Login Status : Message: '+JSON.stringify(e.detail));
        console.log('Cookie saved? '+getCookie('authorization'))
        if(getCookie('authorization')){
            this.loggedIn=true;
            this.homePage=true;
            this.loggedInUser=getCookie('user-name');
            this.fetchDataFromApi();
        }
        console.log(`Logged in? ${this.loggedIn} | User logged in ${this.loggedInUser}`);
    }
    logout(){
        this.hideAll();
        this.loggedInUser='';
        this.loggedIn=false;
        deleteCookies();
        this.logoutFromApi();
    }
    hideAll(){
        this.loggedIn=true;
        this.homePage=false;
        this.updateStock=false;
        this.addEditItems=false;
    }
    navActionAdded(e){
        let navAction=e.detail.action;
        console.log('Navigation action : '+navAction);
        this.navbarOpen=false;
        if(navAction==='Logout'){
           this.logout();
        }else if(navAction==='Home'){
            this.hideAll();
            this.homePage=true;
        }else if(navAction==='updatestock'){
            this.hideAll();
            this.updateStock=true;
        }else if(navAction==='addeditItems'){
            this.hideAll();
            this.addEditItems=true;
        }else{
            this.logout();
        }
    }
    fetchDataFromApi(){
        fetch(baseApiUrl + '/petfood/',{method: "GET",mode: "cors",credentials:"include",withCredentials:true})
        .then((response) => response.json())
        .then((json) => {
            console.log('Items received ' + JSON.stringify(json));
            this.itemset=json;
        })
        .catch((error) => {
            console.log('Error' + JSON.stringify(error));
        });
    }
    logoutFromApi(){
        fetch(baseApiUrl + '/auth',{
            method: 'delete',
            headers: { 'Content-type': 'application/json; charset=UTF-8' },
            credentials:"include",
            withCredentials:true})
        .then((response) => response.json())
        .then((json) => {
            console.log('Logged out' + JSON.stringify(json.logout));
        })
        .catch((error) => {
            console.log('Error' + JSON.stringify(error));
        });
    }
}
