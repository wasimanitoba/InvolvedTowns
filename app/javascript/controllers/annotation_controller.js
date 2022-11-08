import { Controller } from "@hotwired/stimulus"
import { Recogito } from '@recogito/recogito-js';
import '@recogito/recogito-js/dist/recogito.min.css';
export default class extends Controller {
  static targets = ['annotationPayload', 'form', 'tags']

  connect() {
    const self = this;
    const element = this.formTarget;
    self.annotationPayloadTarget.value = '';
    self.recogito = new Recogito({ content: this.element });

    self.recogito.on('createAnnotation', function(annotation) {
      self.annotationPayloadTarget.value = JSON.stringify(annotation);
      self.tagsTarget.value = annotation.body.filter((doc)=> { return doc.purpose === 'tagging'} ).map((doc)=> {return doc.value; }).join(',')
      element.requestSubmit();
      // element.submit()
      // element.dispatchEvent(new Event('submit', {bubbles: false}));
      // Rails.fire(element, 'submit');
    });
  }
}
