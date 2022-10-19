import React from 'react';
import { MultiSelect2 } from "@blueprintjs/select";
import '@github/filter-input-element';
import ReactMarkdown from 'react-markdown';

class LibraryEntry extends React.Component { 
  constructor(props) {
    super(props);
    this.state = { 
      content: props.entry.content,
      tags: props.entry.tags
     };
  }
  render() {
    return (
      <li> <ReactMarkdown>{this.state.content}</ReactMarkdown>
      <sub hidden><sup>{this.state.tags.map((tag)=>{return `${tag.title} ${tag.category}`})}</sup></sub></li>
    )
  }
}

class Library extends React.Component {
  constructor(props) {
    super(props);
    const { entries, renderSelection, setSelectedTag, tags, tagsFilter } = props;
    this.state              = { entries, selectedTags: [], tags, tagsFilter, };
    this.renderSelection    = renderSelection.bind(this);
    this.setSelectedTag     = setSelectedTag.bind(this);
    this.clearTags          = this.clearTags.bind(this);
    this.setSelectedEntries = this.setSelectedEntries.bind(this);
  }

  clearTags() { this.setState({ selectedTags: [] }); this.render(); }

  setSelectedEntries = (event) => {
    let selectedEntries  = this.state.entries.filter((entry) => { 
      let titles = entry.tags.map((tag)=> { return tag.title }); 
      return titles.includes(event.title);
    });
    this.setState({ entries: selectedEntries });
    this.setSelectedTag(event);
  }
    
  render() {
    return (
      <div>
      <filter-input aria-owns="entries" class={'flex justify-apart'}>
        <input placeholder="Filter" type="text" autoFocus autoComplete="off" />
        <MultiSelect2
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
          tagRenderer={(item) => { return(item.title); }}
        />
      </filter-input>
      <div>
        <div id="entries">
          <ul data-filter-list>
            { this.state.entries.map((entry)=> { 
              return <LibraryEntry entry={entry} key={entry.id} /> 
            })}
          </ul>
          {/* <p data-filter-empty-state hidden>0 entries found.</p> */}
        </div>
      </div>
    </div>
    );
  }
}



export default Library;