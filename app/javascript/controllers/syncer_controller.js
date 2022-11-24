import { Controller } from "@hotwired/stimulus"
import PouchDB from 'pouchdb';

// Connects to data-controller="syncer"
export default class extends Controller {
  static targets = ['password']
  static values  = { email: String }

  connect() {
    this.db    = new PouchDB('stackbiblio-development');
    this.tagDB = new PouchDB('tag-store-development');
  }

  async sync() {
    let password = prompt('Provide your password to access your account:')
    if (password === null) { alert('Sorry, cannot access your account without a password.'); return; }
    // TODO: we don't want to hardcode the password or `localhost` here.
    this.db.sync(`http://${this.emailValue}:${password}@localhost:5984/stackbiblio-development`);
  }

  async save() {}

  async delete() {}

  async addTag() {}

  async removeTag() {}
}
