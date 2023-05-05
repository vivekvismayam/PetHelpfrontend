import { LightningElement,api } from 'lwc';
import{getCookie} from '../../my/utils/utils.js'


export default class Home extends LightningElement {
    @api itemset;   
    loggedinuser='.....loading';
    connectedCallback(){
        this.loggedinuser=getCookie('user-name');
    }

}