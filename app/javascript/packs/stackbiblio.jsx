import { HotkeysProvider, MenuItem } from "@blueprintjs/core";
import { useLiveQuery } from "dexie-react-hooks";
import ReactDOM from 'react-dom/client';
import React from 'react'
import Library from './Library.js'
import Dexie from 'dexie'
import Chat from './Chat.js'
import './App.css';

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
  let accumulator = new Set();
  // TODO: Let's add a separate tag store instead of this
  let set         = allItems.reduce(reduceTags, accumulator)
  let tagArray    = Array.from(set);
  
  return (
    <div>
      <div className="tabs">
        <Library
          clearTags={clearTags}
          entries={allItems}
          renderSelection={renderSelection}
          tags={tagArray}
          tagsFilter={tagsFilter}
          />
      </div>
      <HotkeysProvider>
        <Chat
          db={db}
          entries={allItems}
          renderSelection={renderSelection}
          tags={tagArray}
          tagsFilter={tagsFilter}
        />
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