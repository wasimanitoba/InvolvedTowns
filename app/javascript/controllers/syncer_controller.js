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

    this.db.sync(`http://${this.emailValue}:${password}@localhost:5984/${this.getUserDatabaseName(this.emailValue)}`);
  }

/** from: https://terreii.github.io/use-pouchdb/docs/basics/sync
 * Get the name of the users remote-database.
 * This function uses browser APIs.
 * @param {string} name     - The username.
 * @param {string} [prefix] - Prefix, can be changed with config [couch_peruser] database_prefix
 */
 getUserDatabaseName(name, prefix = 'userdb-') {
  const encoder = new TextEncoder()
  const buffy = encoder.encode(name)
  const bytes = Array.from(buffy).map(byte =>
    byte.toString(16).padStart(2, '0')
  )
  return prefix + bytes.join('')
}
}
