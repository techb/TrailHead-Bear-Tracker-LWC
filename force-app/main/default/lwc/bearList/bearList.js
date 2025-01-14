import { NavigationMixin, CurrentPageReference } from 'lightning/navigation';
import { fireEvent } from 'c/pubsub';
import { loadStyle } from 'lightning/platformResourceLoader';
import ursusResources from '@salesforce/resourceUrl/ursus_park';
import { LightningElement, track, wire } from 'lwc';
/** BearController.searchBears(searchTerm) Apex method */
import searchBears from '@salesforce/apex/BearController.searchBears';

export default class BearListNav extends NavigationMixin(LightningElement) {
    @track searchTerm = '';
    @track bears;
    @wire(CurrentPageReference) pageRef;
    @wire(searchBears, {searchTerm: '$searchTerm'})
    loadBears(result) {
        this.bears = result;
        if (result.data) {
            // console.log('-----------------------------');
            // console.log(this.pageRef);
            // console.log('-----------------------------');
            // console.log('-----------------------------');
            // console.log(result.data);
            // console.log('-----------------------------');
            fireEvent(this.pageRef, 'bearListUpdate', result.data);
        }
    }
    connectedCallback() {
        loadStyle(this, ursusResources + '/style.css');
    }
    handleSearchTermChange(event) {
        // Debouncing this method: do not update the reactive property as
        // long as this function is being called within a delay of 300 ms.
        // This is to avoid a very large number of Apex method calls.
        window.clearTimeout(this.delayTimeout);
        const searchTerm = event.target.value;
        // eslint-disable-next-line @lwc/lwc/no-async-operation
        console.log('-----------------------------');
        console.log('before search');
        console.log('-----------------------------');
        this.delayTimeout = setTimeout(() => {
            this.searchTerm = searchTerm;
        }, 300);
    }
    get hasResults() {
        return (this.bears.data.length > 0);
    }
    handleBearView(event) {
        // Get bear record id from bearview event
        const bearId = event.detail;
        // Navigate to bear record page
        this[NavigationMixin.Navigate]({
            type: 'standard__recordPage',
            attributes: {
                recordId: bearId,
                objectApiName: 'Bear__c',
                actionName: 'view',
            },
        });
    }
}