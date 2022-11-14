import PouchDB from 'pouchdb';
import React from 'react';
import ReactDOM from 'react-dom/client';
import ReactMarkdown from 'react-markdown';
import '@github/filter-input-element';
import { MenuItem } from "@blueprintjs/core";
import { MultiSelect2 } from "@blueprintjs/select";

const renderSelection = (selectedItem, { handleClick, handleFocus, modifiers, query }) => {
  if (!modifiers.matchesPredicate) {
    return null;
  }
  return (
    <MenuItem
      active={modifiers.active}
      clear={<button>Clear</button>}
      disabled={modifiers.disabled}
      key={selectedItem.id || selectedItem.key}
      label={selectedItem.category.toString()}
      onClick={handleClick}
      onFocus={handleFocus}
      roleStructure="listoption"
      text={selectedItem.title}
    />
  );
};


class StackBiblio extends React.Component {
  constructor(props) {
    super(props);
    this.renderSelection    = renderSelection.bind(this);
    this.setSelectedTag     = this.setSelectedTag.bind(this);
    this.setSelectedEntries = this.setSelectedEntries.bind(this);
    this.clearTags          = this.clearTags.bind(this);
    const db                = new PouchDB('stackbiblio-development');
    const tagDB             = new PouchDB('tag-store-development');

    this.state = { db, tagDB, notes: [], entries: [], tags: [], selectedTags: [] };
  }

  async componentDidMount() {
    const notes   = await this.getAllNotes();
    const tags    = await this.getAllTags();
    this.setState({ entries:notes.rows, tags: tags.rows || [] });
    this.render()
  }

  async getAllTags() { return await this.state.tagDB.allDocs({ include_docs: true, descending: true }); }

  async getAllNotes() { return await this.state.db.allDocs({ include_docs: true, descending: true }); }

  // TODO: use an API token instead or set up CORS so that the password can only be used by StackBiblio.com
  // TODO: ensure that we can use host URL instead of `localhost`
  async sync() { this.state.db.replicate.to('http://admin1:correctHorseBatteryStaple@localhost:5984/stackbiblio-development'); }

  clearTags() { this.setState({ selectedTags: [] }); this.render(); }

  setSelectedTag = (userSelectedTag) => {
    const selectedTags   = this.state.selectedTags;
    const existingTitles = selectedTags.map((entry) => { return entry.title; })

    if (!existingTitles.includes(userSelectedTag.title)) {
      selectedTags.push(userSelectedTag);
      let tags       = this.state.tags;
      let unselected = tags.splice(tags.indexOf(userSelectedTag.title), 1);
      this.setState({ selectedTags: selectedTags, tags: unselected });
    }
    this.render();
  }

  setSelectedEntries = (event) => {
    let selectedEntries = this.state.entries.filter((entry) => {
      let titles        = entry.tags.map((tag) => { return tag.title });
      return titles.includes(event.title);
    });
    this.setState({ entries: selectedEntries });
    this.setSelectedTag.call(this, event);
  }

  render() {
    return (
      <div>
        <filter-input aria-owns="entries" class={'flex justify-apart'}>
          <input placeholder="Filter" type="text" autoFocus autoComplete="off" />
          {/* <MultiSelect2
            className={'tagsHolder'}
            itemPredicate={this.state.tagsFilter}
            itemRenderer={this.renderSelection}
            items={this.state.tags}
            onItemSelect={this.setSelectedEntries}
            onRemove={(tagToRemove) => {
              let tags = this.state.tags;
              this.setState({
                selectedTags: this.state.selectedTags.filter(tag => tag !== tagToRemove),
                tags: tags.concat(tagToRemove)
              });
              this.render();
            }}
            menuProps={{ "aria-label": "tags" }}
            placeholder={'All Topics'}
            resetOnSelect={this.clearTags}
            selectedItems={this.state.selectedTags}
            tagRenderer={(item) => { return (item.title); }}
          /> */}
        </filter-input>
        <ul id="entries" data-filter-list>
          {this.state.entries.map((entry) => { return <LibraryEntry entry={entry} key={entry.id} /> })}
        </ul>
      </div>
    );
  }
}

class LibraryEntry extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      content: props.entry.doc.content,
      tags: props.entry.doc.tags || []
    };
  }
  render() {
    return (
      <li>
        <ReactMarkdown>{this.state.content}</ReactMarkdown>
        <sub hidden><sup>{this.state.tags.map((tag) => { return `${tag.title} ${tag.category}` })}</sup></sub>
      </li>
    )
  }
}

const rootElement = document.getElementById('library');
if (!rootElement) {
  document.addEventListener('DOMContentLoaded', () => {
    ReactDOM.createRoot(document.getElementById('library')).render(<StackBiblio />);
  });
}
else {
  ReactDOM.createRoot(rootElement).render(<StackBiblio />);
}