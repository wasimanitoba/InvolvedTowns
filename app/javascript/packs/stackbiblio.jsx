import './App.css';
import Dexie from 'dexie'
import React from 'react'
import ReactDOM from 'react-dom/client';
import Chat from './Chat.js'
import { HotkeysProvider } from "@blueprintjs/core";
import Library from './Library.js'
import { useLiveQuery } from "dexie-react-hooks";
import { MenuItem } from "@blueprintjs/core";

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
    return `${tag.id || tag.key}. ${normalizedTitle}`.indexOf(normalizedQuery) >= 0;
  }
};

const clearTags = () => {
  this.setState({ selectedTags: [] })
}

const setSelectedTag = (userSelectedTag) => {
  const selectedTags   = this.state.selectedTags;
  const existingTitles = selectedTags.map((entry) => { return entry.title; })

  if (!existingTitles.includes(userSelectedTag.title)) {
    selectedTags.push(userSelectedTag);
    let tags        = this.state.tags;
    let unselected  = tags.splice(tags.indexOf(userSelectedTag.title), 1);
    this.setState({ selectedTags: selectedTags, tags: unselected });
  }
  this.render();
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

function App() {
  const db = new Dexie('stackbiblio-entries-development')
  db.version(1).stores({ entries: '++id, content, timestamp' })
  let allItems = useLiveQuery(() => db.entries.toArray(), []);
  if (!allItems) return null;

  let tags = allItems.reduce((accumulator, item)=> { 
     item.tags.forEach((tag)=> accumulator.add(tag));
     return accumulator;
    }, 
    new Set());

    tags = Array.from(tags);

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

    <HotkeysProvider>
     <Chat 
        db              ={db} 
        entries         ={entries} 
        renderSelection ={renderSelection}
        tags            ={tags} 
        tagsFilter      ={tagsFilter}
      />
    </HotkeysProvider>
  </div>
  );
}

const rootElement = document.getElementById('root');
if (!rootElement) { document.addEventListener('DOMContentLoaded', ()=>{
  ReactDOM.createRoot(document.getElementById('root')).render(<App />);
});}
else {
    ReactDOM.createRoot(rootElement).render(<App />);
}