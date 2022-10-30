import PouchDB from 'pouchdb';
import React from "react";
import ReactDOM from 'react-dom/client';
import Messages from "./Messages";
import { Icon, MenuItem, TextArea } from "@blueprintjs/core";
import { MultiSelect2 } from "@blueprintjs/select";


const renderCreateNewMenuItem = (query, active, handleClick) => (
  <MenuItem
    icon="add"
    text={`Create ${query}`}
    roleStructure="listoption"
    active={active}
    onClick={handleClick}
    shouldDismissPopover={false}
  />
);

class Chat extends React.Component {
  constructor(props) {
    super(props);
    const { tags, tagsFilter } = props;

    const db             = new PouchDB('stackbiblio-development');
    const tagDB          = new PouchDB('tag-store-development');

    this.handleChange    = this.handleChange.bind(this);
    this.handleSubmit    = this.handleSubmit.bind(this);
    this.setSelectedTag  = this.setSelectedTag.bind(this);
    this.renderSelection = this.renderSelection.bind(this);

    this.state = { db, tagDB, entries: [], currentValue: '', selectedTags: [], tags: [], allTags: tags, tagsFilter };
  }

  async componentDidMount() {
    const doc     = await this.getAllNotes();
    const tags    = await this.getAllTags();
    console.log({doc, tags});
    const entries = doc.rows.map((row)=>{ return row.doc });
    this.setState({ entries, tags: tags.rows || [] });
    this.render();
  }

  async getAllTags() { return await this.state.tagDB.allDocs({include_docs: true, descending: true}); }

  async getAllNotes() { return await this.state.db.allDocs({ include_docs: true, descending: true }); }

  tagsFilter(query, tag, _index, exactMatch) {
    const normalizedTitle = tag.title.toLowerCase();
    const normalizedQuery = query.toLowerCase();

    if (exactMatch) {
      return normalizedTitle === normalizedQuery;
    } else {
      return `${tag.id || tag.key}. ${normalizedTitle}`.indexOf(normalizedQuery) >= 0;
    }
  };

  renderSelection(selectedItem, { handleClick, handleFocus, modifiers, query }) {
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


  setSelectedTag = (userSelectedTag) => {
    const selectedTags = this.state.selectedTags;
    const existingTitles = selectedTags.map((entry) => { return entry.title; })

    if (!existingTitles.includes(userSelectedTag.title)) {
      selectedTags.push(userSelectedTag);
      let tags = this.state.tags;
      let unselected = tags.splice(tags.indexOf(userSelectedTag.title), 1);
      this.setState({ selectedTags: selectedTags, tags: unselected });
    }
    this.render();
  }
  clearTags() { this.setState({ selectedTags: [] }); this.render(); }

  // Update the state with every keystroke
  handleChange(event) {
    this.setState({ currentValue: event.target.value });
  }

  setSelectedTag = (userSelectedTag) => {
    const selectedTags = this.state.selectedTags;
    const existingTitles = selectedTags.map((entry) => { return entry.title; })

    if (!existingTitles.includes(userSelectedTag.title)) {
      selectedTags.push(userSelectedTag);
      let tags = this.state.allTags;
      this.setState({ selectedTags: selectedTags, tags: tags });
    }
    this.render();
  }

  // Add the new message to database, update the current state, clear the input and re-render
  async handleSubmit(event) {
    event.preventDefault();
    await this.addItemToDb().then((newMessage) => {
      const newMessageArray = this.state.entries;
      newMessageArray.push(newMessage);
      this.setState({
        currentValue: '',
        entries: newMessageArray,
        selectedTags: [],
        tags: this.state.allTags
      });
      this.render();
    });
  }

  /**
   * Checks the input for a value, adds the value to the database and returns it.
   * @returns Object - the message which has just been added to the database.
   */
  async addItemToDb() {
    const timestamp  = new Date();
    const key        = `chatID-${timestamp.valueOf()}`;
    const content    = this.state.currentValue;
    const tags       = this.state.selectedTags;
    const newMessage = { content, tags, timestamp, _id: key, key };

    await this.state.db.put(newMessage);

    return newMessage;
  }

  render() {
    const handleInputRef = (el) => (this.inputEl = el);

    const entries = this.state.entries;

    return (
      <details open className={'chat-toggle'}>
      <summary><Icon icon={'chat'} size={40} intent={'primary'} /><span className={''}><h2 className={'auto-margin'}>Note Stack</h2></span></summary>

      <div className="chat">
        <div className="messages">
          <div id="messages-content" className="messages-content">
            <Messages db={this.state.db} entries={entries || []} tags={[]} />
          </div>
        </div>
        <div className="chat-tags message-box">
          <form onSubmit={this.handleSubmit} >
            <div className="flex message-input">
              <TextArea
                onChange={this.handleChange}
                placeholder="Send yourself a note..."
                ref={handleInputRef}
                value={this.state.currentValue}
              />
              <button type="submit" className="message-submit">Send</button>
            </div>
          </form>
          <MultiSelect2
            className={'tagsHolder'}
            createNewItemFromQuery={(inputText) => {
              return { title: inputText, id: `${Math.floor(Math.random() * 1000)}-${new Date().valueOf()}`, category: '' };
            }}
            createNewItemRenderer={renderCreateNewMenuItem}
            itemPredicate={this.state.tagsFilter}
            itemRenderer={this.renderSelection}
            items={this.state.tags || []}
            onItemSelect={this.setSelectedTag}
            onRemove={(tagToRemove) => {
              let tags = this.state.tags;
              this.setState({
                selectedTags: this.state.selectedTags.filter(tag => tag !== tagToRemove),
                tags: Array.from(new Set(tags.concat(tagToRemove)))
              });
              this.render();
            }}
            menuProps={{ "aria-label": "tags" }}
            placeholder={'All Topics'}
            resetOnSelect={this.clearTags}
            selectedItems={this.state.selectedTags}
            tagRenderer={(item) => { return item.title; }}
          />
        </div>
      </div>
    </details>
    )
  }
}


const rootElement = document.getElementById('react-chat-container');
if (!rootElement) {
  document.addEventListener('DOMContentLoaded', () => {
    ReactDOM.createRoot(document.getElementById('react-chat-container')).render(<Chat />);
  });
}
else {
  ReactDOM.createRoot(rootElement).render(<Chat />);
}