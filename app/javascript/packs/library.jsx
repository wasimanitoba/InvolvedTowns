import Dexie from 'dexie';
import React from 'react';
import ReactDOM from 'react-dom/client';
import ReactMarkdown from 'react-markdown';
import '@github/filter-input-element';
import { MenuItem } from "@blueprintjs/core";
import { MultiSelect2 } from "@blueprintjs/select";
import { useLiveQuery } from "dexie-react-hooks";

const tagsFilter = (query, tag, _index, exactMatch) => {
  const normalizedTitle = tag.title.toLowerCase();
  const normalizedQuery = query.toLowerCase();

  if (exactMatch) {
    return normalizedTitle === normalizedQuery;
  } else {
    return `${tag.id || tag.key}. ${normalizedTitle}`.indexOf(normalizedQuery) >= 0;
  }
};

const clearTags = () => {
  this.setState({ selectedTags: [] })
}

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


function StackBiblio() {
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

  return (<Library clearTags={clearTags} entries={allItems} renderSelection={renderSelection} tags={tagArray} tagsFilter={tagsFilter} />);
}

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
        <sub hidden><sup>{this.state.tags.map((tag) => { return `${tag.title} ${tag.category}` })}</sup></sub></li>
    )
  }
}

class Library extends React.Component {
  constructor(props) {
    super(props);
    const { entries, renderSelection, setSelectedTag, tags, tagsFilter } = props;
    this.state = { entries, selectedTags: [], tags, tagsFilter, };
    this.renderSelection    = renderSelection.bind(this);
    this.setSelectedTag     = this.setSelectedTag.bind(this);
    this.setSelectedEntries = this.setSelectedEntries.bind(this);
    this.clearTags          = this.clearTags.bind(this);
  }

  clearTags() { this.setState({ selectedTags: [] }); this.render(); }


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

  setSelectedEntries = (event) => {
    let selectedEntries = this.state.entries.filter((entry) => {
      let titles = entry.tags.map((tag) => { return tag.title });
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
            tagRenderer={(item) => { return (item.title); }}
          />
        </filter-input>
        <ul id="entries" data-filter-list>
          {this.state.entries.map((entry) => {
            return <LibraryEntry entry={entry} key={entry.id} />
          })}
        </ul>
      </div>
    );
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