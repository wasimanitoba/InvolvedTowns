import { Controller } from "@hotwired/stimulus"

// Connects to data-controller="tab"
export default class extends Controller {
  connect() {
    const tabContainer = document.querySelector('div.tab-container');
    tabContainer.querySelectorAll('div[role="tablist"] > button').forEach((button)=>{
      button.addEventListener('click', (event)=>{
        tabContainer.querySelector('div[role="tabpanel"]:not([hidden])').hidden = true;
        tabContainer.querySelector(`div[role="tabpanel"][aria-labelledby="${event.currentTarget.id}"]`).hidden = false;
      })
    });


  }
}
