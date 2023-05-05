import { LightningElement } from 'lwc';
import {baseApiUrl} from "../../../resources/config.js";
import{getCookie, setCookie} from '../../my/utils/utils.js'

export default class Login extends LightningElement {
    username = '';
    password = '';
    authStatus = false;
    errMsg = false;
    changedUsername(e) {
        this.username = e.target.value;
        //console.log('Username :'+this.username)
    }
    changedPassword(e) {
        this.password = e.target.value;
    }
    submitLogin() {
        if (this.username === '' || this.password === '') {
            this.errMsg = 'Enter both Username and Password';
        } else {
            //console.log('Submitting  :' + this.username + ' ' + this.password);
            //Check in DB
            this.loginViaApi();
        }
    }
    removeError() {
        this.errMsg = false;
    }
    loginViaApi() {
        let data = { email: this.username, password: this.password };
        fetch(baseApiUrl + '/auth', {
            method: 'post',
            body: JSON.stringify(data),
            headers: { 'Content-type': 'application/json; charset=UTF-8' },
            credentials:"include",
            withCredentials:true
        })
            .then((response) =>response.json())
            .then((json) => {
                console.log('Response ' + JSON.stringify(json));
                if(json.authorization){
                    console.log('login Success');
                    //document.cookie='authoriztion=true;path=/;';
                    setCookie('authorization',true,1)
                    setCookie('user-name',json.name,1);
                    setCookie('isAdmin',json.isAdmin,1);
                    let login = new CustomEvent('loginstatus', {
                        detail: {
                            'authorization':true
                        }
                    });
                    this.dispatchEvent(login);
                    this.errMsg=false;
                    console.log('Cookie saved? '+getCookie('authorization'));
                }else{
                    this.username='';
                    this.password='';
                    this.errMsg=json.error;
                }
            })
            .catch((error) => {
                console.log('Error' + error+JSON.stringify(error));
                this.username='';
                this.password='';
                this.errMsg=JSON.stringify(error);
            });
    }
   
}
