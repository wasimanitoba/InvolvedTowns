import Dexie from 'dexie';
import React from "react";
import ReactDOM from 'react-dom/client';
import Messages from "./Messages";
import { HotkeysProvider, Icon, MenuItem, TextArea } from "@blueprintjs/core";
import { useLiveQuery } from "dexie-react-hooks";
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

const tagsFilter = (query, tag, _index, exactMatch) => {
  const normalizedTitle = tag.title.toLowerCase();
  const normalizedQuery = query.toLowerCase();

  if (exactMatch) {
    return normalizedTitle === normalizedQuery;
  } else {
    return `${tag.id || tag.key}. ${normalizedTitle}`.indexOf(normalizedQuery) >= 0;
  }
};

function Stack() {
  const db = new Dexie('stackbiblio-entries-development')
  db.version(1).stores({ entries: '++id, content, timestamp' })
  let allItems = useLiveQuery(() => db.entries.toArray(), []);
  if (!allItems) return null;

  let titles = new Set();
  let tagArray = [];
  // TODO: Let's add a separate tag store instead of this
  allItems.forEach((item) => {
    item.tags.forEach((tag) => {
      if (!titles.has(tag.title)) {
        tagArray.push(tag);
        titles.add(tag.title);
      }
    });
  })

  return (
    <HotkeysProvider>
      <details className={'chat-toggle'}>
        <summary><Icon icon={'chat'} size={40} intent={'primary'} /><span className={''}><h2 className={'auto-margin'}>Note Stack</h2></span></summary>
        <Chat db={db} entries={allItems} renderSelection={renderSelection} tags={tagArray} tagsFilter={tagsFilter} />
      </details>
    </HotkeysProvider>
  );
}

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
    const { db, entries, renderSelection, tags, tagsFilter } = props;
    this.state = { db, entries, currentValue: '', selectedTags: [], tags, allTags: tags, tagsFilter };
    this.handleChange    = this.handleChange.bind(this);
    this.handleSubmit    = this.handleSubmit.bind(this);
    this.setSelectedTag  = this.setSelectedTag.bind(this);
    this.renderSelection = renderSelection.bind(this);
  }
  
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
    const selectedTags   = this.state.selectedTags;
    const existingTitles = selectedTags.map((entry) => { return entry.title; })

    if (!existingTitles.includes(userSelectedTag.title)) {
      selectedTags.push(userSelectedTag);
      let tags       = this.state.allTags;
      let spliced = tags.splice(tags.indexOf(userSelectedTag.title), 1);
      console.log(tags, selectedTags, spliced);
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

  // Checks the input for a value, adds the value to the database and returns it.
  async addItemToDb() {
    const newMessage = {
      content: this.state.currentValue,
      tags: this.state.selectedTags,
      timestamp: new Date(),
      key: `chatID-${new Date()}`
    };

    await this.state.db.entries.add(newMessage);
    return newMessage;
  }

  render() {
    const handleInputRef = (el) => (this.inputEl = el);

    return (
      <div className="chat">
        <div className="messages">
          <div id="messages-content" className="messages-content">
            <Messages db={this.state.db} entries={this.state.entries} />
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
            createNewItemFromQuery={(inputText)=>{ 
              return { title: inputText, id: `${Math.floor(Math.random() * 1000)}-${new Date().valueOf()}`, category: ''};
            }}
            createNewItemRenderer={renderCreateNewMenuItem}
            itemPredicate={this.state.tagsFilter}
            itemRenderer={this.renderSelection}
            items={this.state.tags}
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
    )
  }
}


const rootElement = document.getElementById('react-chat-container');
if (!rootElement) {
  document.addEventListener('DOMContentLoaded', () => {
    ReactDOM.createRoot(document.getElementById('react-chat-container')).render(<Stack />);
  });
}
else {
  ReactDOM.createRoot(rootElement).render(<Stack />);
}

