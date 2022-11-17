import PouchDB from 'pouchdb';
import React from "react";
import ReactDOM from 'react-dom/client';
import Messages from "./Messages";
import { Icon, MenuItem } from "@blueprintjs/core";
import { MultiSelect2 } from "@blueprintjs/select";

const db     = new PouchDB('stackbiblio-development');
const tagDB  = new PouchDB('tag-store-development');

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

    // this.handleChange    = this.handleChange.bind(this);
    this.handleSubmit    = this.handleSubmit.bind(this);
    this.setSelectedTag  = this.setSelectedTag.bind(this);
    this.renderSelection = this.renderSelection.bind(this);

    this.state = { entries: [], currentValue: '', selectedTags: [], tags: [], allTags: tags, tagsFilter };
  }

  async componentDidMount() {
    const doc     = await this.getAllNotes();
    const tags    = await this.getAllTags();

    const entries = doc.rows.map((row)=>{ return row.doc });


    entries.sort((first, second)=> {
      if (first.timestamp < second.timestamp) { return -1; }
      else if (first.timestamp > second.timestamp) { return 1; }
      return 0;
     });

    entries[entries.length - 1].className = 'last-message';

    this.setState({ entries, tags: tags.rows || [] });

    window.requestAnimationFrame(()=>{
      let lastMessage = document.querySelectorAll('.last-message');
      if (lastMessage.length > 0) { lastMessage[lastMessage.length - 1].scrollIntoView();  }
    })

    this.render();
  }

  async getAllTags() { return await tagDB.allDocs({include_docs: true, descending: true}); }

  async getAllNotes() { return await db.allDocs({ include_docs: true, descending: true }); }

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

  // Add the new message to database, update the current state, clear the input and re-render
  async handleSubmit(event) {
    // If I use controlled component values, the UI becomes laggy and every keystroke is delayed.

    event.preventDefault();
    let currentMessageValue = event.target.querySelector('textarea').value;
    const self = this;
    await self.addItemToDb(currentMessageValue).then((newMessage) => {

      // get the list of messages
      const newMessageArray = self.state.entries;

      // add the new message
      newMessageArray.push(newMessage);

      // reset the input field
      event.target.querySelector('textarea').value = '';

      newMessageArray.sort((first, second)=> {
        if (first.timestamp < second.timestamp) { return -1; }
        else if (first.timestamp > second.timestamp) { return 1; }
        return 0;
       });

      // update state
      self.setState({
        // currentValue: '',
        entries: newMessageArray,
        selectedTags: [],
        tags: self.state.allTags
      });

      window.requestAnimationFrame(()=>{
        let lastMessage = document.querySelectorAll('.last-message');
        if (lastMessage.length > 0) { lastMessage[lastMessage.length - 1].scrollIntoView();  }
      })

      self.render();
    });
  }

  /**
   * Adds the input value to the database and returns it.
   * @returns Object - the message which has just been added to the database.
  */
  async addItemToDb(content) {
    const timestamp  = new Date();
    const key        = `chatID-${timestamp.valueOf()}`;
    const tags       = this.state.selectedTags;
    const bigNumber  = Math.floor(Math.random() * 10000000000000);
    const newMessage = { content, tags, timestamp, _id: key, key, id: bigNumber };

    await db.put(newMessage);

    return newMessage;
  }

  render() {
    const entries = this.state.entries.sort((first, second)=> { first.timestamp - second.timestamp});
    return (
      <details className={'chat-toggle'}>
`      <summary>
        <Icon icon={'chat'} size={40} intent={'primary'} />
        <span>
          <h2 className={'auto-margin'}>Note Stack</h2>
        </span>
      </summary>

      <div className="chat">
        <div className="messages">
          <div id="messages-content" className="messages-content">
            {/* the most recent entry has no _rev value...that shouldn't matter. why does it? workaround? TODO */}
            <Messages db={db} entries={entries || []} tags={[]} />
          </div>
        </div>
        <div className="chat-tags message-box">
          <form onSubmit={this.handleSubmit}>
            <div className="flex message-input">
              <textarea placeholder='Send yourself a note' cols="30" rows="10"></textarea>
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
      </div>`
    </details>
    )
  }
}


const rootElement = document.getElementById('react-chat-container');

if (rootElement) { ReactDOM.createRoot(rootElement).render(<Chat />); }
else {
  document.addEventListener('DOMContentLoaded', () => {
    ReactDOM.createRoot(document.getElementById('react-chat-container')).render(<Chat />);
  });
}