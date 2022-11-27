import { Controller } from "@hotwired/stimulus"
import PouchDB from 'pouchdb';
export default class extends Controller {
  static targets = ['file', 'text']
  uploadFile(_event) {
    const self = this;
    const reader = new FileReader();
    reader.onload = (evt) => {
      let result = evt.target.result;
      const notesArray = JSON.parse(result);
      self.db.bulkDocs(notesArray)
    };

  }

  connect() {
    this.db = new PouchDB('stackbiblio-development');
   }

}
