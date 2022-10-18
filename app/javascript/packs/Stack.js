import React from 'react';
import Chat from './chat.js'
import { HotkeysProvider } from "@blueprintjs/core";

const Stack = (props) => {
  const { db, entries, renderSelection, tags, tagsFilter } = props;

  return (
    <HotkeysProvider>
     <Chat 
        db              ={db} 
        entries         ={entries} 
        renderSelection ={renderSelection}
        tags            ={tags} 
        tagsFilter      ={tagsFilter}
      />
    </HotkeysProvider>
  )
}

export default Stack