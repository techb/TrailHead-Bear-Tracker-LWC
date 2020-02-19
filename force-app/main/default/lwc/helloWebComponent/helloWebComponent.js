import { LightningElement, track } from 'lwc';

export default class HelloWebComponent extends LightningElement {
    @track greeting = "Trailblazer";

    handleGreetingChange(event){
        this.greeting = event.target.value;
    }
}