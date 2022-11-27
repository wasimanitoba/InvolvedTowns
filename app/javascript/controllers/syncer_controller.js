import { Controller } from "@hotwired/stimulus"
import PouchDB from 'pouchdb';
import PouchdbAuthentication from 'pouchdb-authentication'

// Connects to data-controller="syncer"
export default class extends Controller {
  static targets = ['password']
  static values = { email: String }

  connect() {
    PouchDB.plugin(PouchdbAuthentication)
    this.db = new PouchDB('stackbiblio-development');
   }

  // https://terreii.github.io/use-pouchdb/docs/basics/sync
  getUserDatabaseName() {
    const prefix = 'userdb-';
    const encoder = new TextEncoder()
    const buffy = encoder.encode(this.emailValue)
    const bytes = Array.from(buffy).map(byte =>
      byte.toString(16).padStart(2, '0')
    )
    return prefix + bytes.join('')
  }

  async sync() {
    let password = prompt('Provide your password to access your account:')
    if (password === null) { alert('Sorry, cannot access your account without a password.'); return; }

    const remoteDB = new PouchDB(`http://155.138.130.142:5984/${this.getUserDatabaseName()}`,
      { auth: { username: this.emailValue, password } })

    this.db.sync(remoteDB, {live: true, retry: true}).
            on('denied', console.log.bind(console)).
            on('error', console.log.bind(console));
    }
}
