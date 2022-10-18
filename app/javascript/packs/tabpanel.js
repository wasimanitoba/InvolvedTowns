import React from 'react';
import Biblio from './Biblio.js'
import TabSidebar from './tabsidebar.js'
import '@github/filter-input-element';

const TabPanel = (props) => {
  const { entries, renderSelection, tags, tagsFilter } = props;

  return (
    <div>
      <filter-input aria-owns="entries" class={'flex justify-apart'}>
        <input placeholder="Filter" type="text" autoFocus autoComplete="off" />
        <TabSidebar
          renderSelection={renderSelection}
          tags={tags}
          tagsFilter={tagsFilter}
        />
      </filter-input>
      <Biblio entries={entries} />
    </div>
  )
}

export default TabPanel;