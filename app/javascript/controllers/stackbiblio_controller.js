import App from './../packs/App'
import React from 'react'
import ReactDOM from 'react-dom/client';
import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ['root']
  
  connect() {
    ReactDOM.createRoot(this.rootTarget).render(<App />);
  }
}