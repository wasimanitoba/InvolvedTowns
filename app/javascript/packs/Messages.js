import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Icon, Tag } from "@blueprintjs/core";


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

export default Messages;