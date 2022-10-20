import Messages from "./Messages";
import React from "react";
import { MenuItem, TextArea } from "@blueprintjs/core";
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
    const { db, entries, renderSelection, setSelectedTag, tags, tagsFilter } = props;
    this.state = { db, entries, currentValue: '', selectedTags: [], tags, allTags: tags, tagsFilter };
    this.handleChange    = this.handleChange.bind(this);
    this.handleSubmit    = this.handleSubmit.bind(this);
    this.setSelectedTag  = this.setSelectedTag.bind(this);
    this.renderSelection = renderSelection.bind(this);
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
                growVertically={true}
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

export default Chat
