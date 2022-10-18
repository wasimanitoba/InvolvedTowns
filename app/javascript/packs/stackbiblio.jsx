import './App.css';
import Dexie from 'dexie'
import React from 'react'
import ReactDOM from 'react-dom/client';
import Stack from './Stack.js'
import TabPanel from './tabpanel.js'
import { useLiveQuery } from "dexie-react-hooks";
// import CommandPalette from 'react-command-palette';
import {
  Button,
  Card,
  MenuItem,
  Navbar,
  NavbarDivider,
  NavbarGroup,
  NavbarHeading
} from "@blueprintjs/core";

const commands = [{
  name: "Foo",
  command() { console.log('foo'); }
}, {
  name: "Bar",
  command() { console.log('bar'); }
}
];

const tagsFilter = (query, tag, _index, exactMatch) => {
  const normalizedTitle = tag.title.toLowerCase();
  const normalizedQuery = query.toLowerCase();

  if (exactMatch) {
    return normalizedTitle === normalizedQuery;
  } else {
    return `${tag.rank}. ${normalizedTitle} ${tag.year}`.indexOf(normalizedQuery) >= 0;
  }
};

const clearTags = () => {
  this.setState({ selectedTags: [] })
}

const setSelectedTag = (event) => {
  const newArray = this.state.selectedTags;
  const existingTitles = newArray.map((entry) => { return entry.title; })
  if (!existingTitles.includes(event.title)) {
    newArray.push(event);
    this.setState({ selectedTags: newArray });
  }
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
      key={selectedItem.rank}
      label={selectedItem.category.toString()}
      onClick={handleClick}
      onFocus={handleFocus}
      roleStructure="listoption"
      text={`${selectedItem.rank}. ${selectedItem.title}`}
    />
  );
};

function App() {
  const tags = [
    { title: "Movies to Watch", category: '' },
    { title: "Bookmarks", category: '', core: true },
    { title: "Notes", category: '', core: true },
  ].map((f, index) => ({ ...f, rank: index + 1 }))

  const db = new Dexie('stackbiblio-entries')
  db.version(1).stores({ entries: '++id, content, timestamp' })
  const allItems = useLiveQuery(() => db.entries.toArray(), []);
  if (!allItems) return null;

  return (
    <div>
    {/* <Navbar className={'flex justify-apart'}>
    <NavbarGroup>
      <NavbarHeading>StackBiblio</NavbarHeading>
      <NavbarDivider />
      <Button icon="home" text="Home" />
      <Button icon="document" text="Files" />
    </NavbarGroup>
    <NavbarGroup>
      {<CommandPalette
        hotKeys={'q+w'}
        commands={commands}
        trigger={
          <Button fill={true}>Commands</Button>
        } /> }
    </NavbarGroup>
  </Navbar> */}

    <div className="tabs">
      <TabPanel
        clearTags={clearTags}
        entries={allItems}
        renderSelection={renderSelection}
        setSelectedTag={setSelectedTag}
        tags={tags}
        tagsFilter={tagsFilter}
      />
    </div>
    <Stack
        clearTags={clearTags}
        db={db}
        entries={allItems}
        renderSelection={renderSelection}
        setSelectedTag={setSelectedTag}
        tags={tags}
        tagsFilter={tagsFilter}
      />
  </div>
  );
}

const rootElement = document.getElementById('root')
if (!rootElement) { document.addEventListener('DOMContentLoaded', ()=>{
  ReactDOM.createRoot(document.getElementById('root')).render(<App />);
});}
else {
    ReactDOM.createRoot(rootElement).render(<App />);
}