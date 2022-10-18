import React from "react";
import ReactMarkdown from 'react-markdown';
import { Card, HotkeysTarget2, Icon, TextArea, Tag } from "@blueprintjs/core";
import { MultiSelect2 } from "@blueprintjs/select";

const Messages = (props) => {
  const messages = (props.entries.map(({ id, tags, timestamp, content, notes }) => {
    return <Message db={props.db} key={id} id={id} tags={tags} timestamp={timestamp} value={content} notes={notes} />
  }));

  messages.reverse();
  return messages;
}

class Message extends React.Component {
  constructor(props) {
    super(props);
    let { db, id, timestamp, tags, value, notes } = props;
    this.state = { db, id, notes, timestamp, tags, value, deleted: false };
  }
  annotations() {
    if (!this.state.notes) { return null; }
    return (
      <details>
        <summary>Annotations</summary>
        {this.state.notes}
      </details>
    )
  }
  render() {
    if (this.state.deleted) { return null; }
    return (
      <div id="mCSB_1_container" className="mCSB_container mCS_y_hidden mCS_no_scrollbar_y">
        <div className="message left">
          <hr />
          <form onSubmit={(event) => {
            event.preventDefault();
            this.state.db.entries.delete(this.state.id);
            // let's add a confirmation modal here
            this.setState({ deleted: true })
            this.render()
          }}>
            <div className="flex justify-apart timestamp">
              <p>{new Date(this.state.timestamp).toLocaleString()}</p>
              {this.annotations()}
              <details>
                <summary>Actions</summary>
                <table>
                  <tbody>
                    <tr>
                      <td>
                        <label>Delete</label>
                      </td>
                      <td>
                        <button type="submit"><Icon icon={'delete'} intent={'danger'} /></button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </details>
            </div>
            <ReactMarkdown>{this.state.value}</ReactMarkdown>
          </form>
          <div className="tags">{
            this.state.tags.map((tag) => {
              return (
                <Tag
                  key={tag.title}
                  onRemove={() => {
                    let updatedTags = this.state.tags.filter(t => t !== tag)
                    this.setState({ tags: updatedTags });
                    this.state.db.entries.update(this.state.id, { tags: updatedTags }).then(() => {
                      this.render()
                    })
                  }}
                >
                  {`${tag.title} ${tag.category}`}
                </Tag>
              )
            })}
          </div>
        </div>
      </div>
    );
  }
}

class Chat extends React.Component {
  constructor(props) {
    super(props);
    const { db, entries, renderSelection, tags, tagsFilter } = props;
    this.state = { db, entries, currentValue: '', selectedTags: [], tags, tagsFilter };
    this.renderSelection = renderSelection.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.setSelectedTag = this.setSelectedTag.bind(this);
  }

  clearTags() {
    this.setState({ selectedTags: [] })
  }

  setSelectedTag(event) {
    const newArray = this.state.selectedTags;
    const existingTitles = newArray.map((entry) => { return entry.title; })
    if (!existingTitles.includes(event.title)) {
      newArray.push(event);
      this.setState({ selectedTags: newArray });
    }
  }

  // Update the state with every keystroke
  handleChange(event) {
    this.setState({ currentValue: event.target.value });
  }

  // Add the new message to database, update the current state, clear the input and re-render
  async handleSubmit(event) {
    event.preventDefault();
    await this.addItemToDb().then((newMessage) => {
      const newMessageArray = this.state.entries;
      newMessageArray.push(newMessage);
      this.setState({ currentValue: '', entries: newMessageArray, selectedTags: [] });
      this.render();
    });
  }

  // Checks the input for a value, adds the value to the database and returns it.
  async addItemToDb() {
    const newMessage = {
      content: this.state.currentValue,
      tags: this.state.selectedTags,
      timestamp: new Date(),
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
            itemPredicate={this.state.tagsFilter}
            itemRenderer={this.renderSelection}
            items={this.state.tags}
            onItemSelect={this.setSelectedTag}
            onRemove={(tagToRemove) => {
              this.setState({ selectedTags: this.state.selectedTags.filter(tag => tag !== tagToRemove) })
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
