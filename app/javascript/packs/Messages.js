import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Icon, Tag } from "@blueprintjs/core";

const Messages = (props) => {
  const messages = (props.entries.map((doc) => {
    return <Message db={props.db} tags={doc.tags || []} doc={doc} />
  }));

  return messages;
}

class Message extends React.Component {
  constructor(props) {
    super(props);
    let { db, tags, doc } = props;
    let className = doc.className;
    let id = doc._id;
    let rev = doc._rev;
    let key = doc.key;
    let timestamp = doc.timestamp;
    let notes = doc.notes;
    let value = doc.content;
    this.state = { className, db, id, rev, notes, timestamp, tags, value, deleted: false };
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
    if (this.state.deleted === true) { return null; }
    const db = this.state.db;
    const rev = this.state.rev;
    const id = this.state.id;
    return (
      <div key={this.state.key} className={this.state.className || 'message'}>
        <div className="message left">
          <hr />
          <form onSubmit={(event) => {
            event.preventDefault();
            if(window.confirm('Do you really want to delete?')){
              db.remove(_id, _rev);
              this.setState({ deleted: true })
              this.render()
            }
          }}>
            <div className="timestamp">
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
                    this.state.db.update(this.state.id, { tags: updatedTags }).then(() => {
                      this.render()
                    })
                  }}
                >
                  {`${tag.title} ${tag.category}`}
                </Tag>
              )
            })

          }
          </div>
        </div>
      </div>
    );
  }
}

export default Messages;