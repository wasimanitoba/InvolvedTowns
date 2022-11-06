import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ['sourceToAdd', 'sourcesList', 'websiteList']
  static values  = { alreadyAddedList: Array }

  // Thredded JS doesn't work well with the Stimulus Actions so we set an event listener instead
  connect() {
    this.websiteListTarget.value = '';
    this.sourceToAddTarget.addEventListener('keypress', this.submitOnEnter.bind(this));
  }

  submitOnEnter(evt) { if (evt.key === 'Enter') { this.addSourceLink(); evt.preventDefault(); } }

  stripPrefixAndTrailingSlashes(url) {
    if (!url) { return false; }
    const regexp = /(http[s]?:\/\/(www.)?)?(?<path>[^/+$]+)/igm
    for (let result of url.matchAll(regexp)) { return result.groups.path; }
  }

  addSourceLink() {
    const path = this.retriveLink();

    if (path) { this.sourcesListTarget.append(this.linkListItem(path)); }
  }

  retriveLink() {
    const url  = this.sourceToAddTarget.value;
    const path = this.stripPrefixAndTrailingSlashes(url);

    if (!path || this.alreadyAddedListValue.includes(path)) { return false; }

    return this.updateAndClearList(path);
  }

  updateAndClearList(path) {
    this.sourceToAddTarget.value = '';
    const updatedList = this.alreadyAddedListValue.concat(path);
    this.updateList(updatedList);
    return path;
  }

  updateList(updatedList) {
    this.alreadyAddedListValue = updatedList;
    this.websiteListTarget.value = updatedList;
  }

  linkListItem(path) {
    const li     = document.createElement('p')
    const text   = document.createTextNode(path);
    li.appendChild(text);
    li.append(this.deletionButton(path))
    return li;
  }

  deletionButton(path) {
    const button             = document.createElement('span');
    button.dataset['action'] = 'click->submission#removeCitation';
    button.dataset['url']    = path;
    button.innerText         = '[x]';
    button.title             = 'Click to Remove';
    return button;
  }

  // let's create a button which can remove the source link
  removeCitation(evt) {
    let values = this.alreadyAddedListValue
    values.splice(evt.currentTarget.dataset.url);
    this.updateList(values);
    evt.currentTarget.parentElement.remove();
  }
}
