import { Controller } from "@hotwired/stimulus"
import PouchDB from 'pouchdb';

// Connects to data-controller="syncer"
export default class extends Controller {
  connect() {
    this.db    = new PouchDB('stackbiblio-development');
    this.tagDB = new PouchDB('tag-store-development');  
  }

  async sync() {
    // TODO: we don't want to hardcode the password or `localhost` here.
    this.db.sync('http://admin1:correctHorseBatteryStaple@localhost:5984/stackbiblio-development');
  }
}
