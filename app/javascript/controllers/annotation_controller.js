import { Controller } from "@hotwired/stimulus"


export default class extends Controller {
  static targets = ['annotationPayload', 'form', 'tags']

  connect() {
    const self = this;
    const element = this.formTarget;
    self.annotationPayloadTarget.value = '';
  }
}
