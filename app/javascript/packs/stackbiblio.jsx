import { HotkeysProvider, Icon, MenuItem } from "@blueprintjs/core";
import { useLiveQuery } from "dexie-react-hooks";
import ReactDOM from 'react-dom/client';
import React from 'react'
import Library from './Library.js'
import Dexie from 'dexie'
import Chat from './Chat.js'

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
const reduceTags = (accumulator, item) => {
  item.tags.forEach((tag) => accumulator.add(tag));
  return accumulator;
}

function App() {
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
    <div>
      <Library
        clearTags={clearTags}
        entries={allItems}
        renderSelection={renderSelection}
        tags={tagArray}
        tagsFilter={tagsFilter}
      />
      <HotkeysProvider>
        <details className={'chat-toggle'}>
          <summary><Icon icon={'chat'} size={40} intent={'primary'} /><span className={''}><h2 className={'auto-margin'}>Note Stack</h2></span></summary>
          <Chat db={db} entries={allItems} renderSelection={renderSelection} tags={tagArray} tagsFilter={tagsFilter} />
        </details>
      </HotkeysProvider>
    </div>
  );
}

const rootElement = document.getElementById('root');
if (!rootElement) {
  document.addEventListener('DOMContentLoaded', () => {
    ReactDOM.createRoot(document.getElementById('root')).render(<App />);
  });
}
else {
  ReactDOM.createRoot(rootElement).render(<App />);
}