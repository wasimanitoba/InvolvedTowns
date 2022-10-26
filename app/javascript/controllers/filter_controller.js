
import { Controller } from "@hotwired/stimulus"

export default class extends Controller { 
  connect() {
    import('@github/filter-input-element').then(()=>{
      console.log('connected');
    })
  }
}