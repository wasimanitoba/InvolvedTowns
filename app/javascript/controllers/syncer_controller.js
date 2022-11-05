import { Controller } from "@hotwired/stimulus"
import PouchDB from 'pouchdb';

// Connects to data-controller="syncer"
export default class extends Controller {
  static targets = ['password']

  connect() {
    this.db    = new PouchDB('stackbiblio-development');
    this.tagDB = new PouchDB('tag-store-development');
  }

  async sync() {
    // TODO: we don't want to hardcode the password or `localhost` here.
    this.db.sync('http://admin1:correctHorseBatteryStaple@localhost:5984/stackbiblio-development');
  }

  createAccount() {
    console.log(this.passwordTarget.value)
  }

  async save() {}

  async delete() {}

  async addTag() {}

  async removeTag() {}
}
