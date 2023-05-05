import { LightningElement, track } from 'lwc';
import { getCookie } from '../../my/utils/utils.js';

export default class Navbar extends LightningElement {
    navbarOpen = false;
    navbarCSS = 'navbar';
    isAdmin = false;
    @track navContents='';
    
    connectedCallback() {
       this.loadNavItems();
    }
    async loadNavItems(){
        this.isAdmin = await getCookie('isAdmin');
        this.isAdmin=(this.isAdmin=='true');
        console.log('Is Admin: '+this.isAdmin);
        this.navContents = [
            { Id: 1, title: 'Home', action: 'Home', show: true },
            { Id: 2, title: 'Update Stock', action: 'updatestock', show: true },
            { Id: 4, title: 'Add/Edit Items',action: 'addeditItems',show: this.isAdmin},
            { Id: 5, title: 'Logout', action: 'Logout', show: true }
        ];
        console.log('Nav Items '+JSON.stringify(this.navContents));
    }
    toggleNavbar() {
        this.navbarOpen = this.navbarOpen ? false : true;
        console.log(' open? ' + this.navbarOpen);
        this.navbarCSS = this.navbarOpen ? 'navbar open' : 'navbar';
    }

    navItemClicked(e) {
        let actionInvolked = e.currentTarget.getAttribute('data-action');
        console.log(
            'Nav item clicked : ' +
                e.currentTarget.id +
                ' | Action : ' +
                actionInvolked
        );
        let navAction = new CustomEvent('navaction', {
            detail: { action: actionInvolked }
        });
        this.dispatchEvent(navAction);
        this.toggleNavbar();
    }
}
