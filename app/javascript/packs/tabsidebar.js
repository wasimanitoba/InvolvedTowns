import React from 'react';
import { MultiSelect2 } from "@blueprintjs/select";

class TabSidebar extends React.Component {
  constructor(props) {
    super(props);
    const { renderSelection, tags, tagsFilter } = props;
    this.state           = { tags, tagsFilter, selectedTags: [] };
    this.renderSelection = renderSelection.bind(this);
    this.clearTags       = this.clearTags.bind(this);
    this.setSelectedTag  = this.setSelectedTag.bind(this);
  }

  clearTags() {
    this.setState({ selectedTags: [] });
  }
  
  setSelectedTag(event) {
    const newArray       = this.state.selectedTags;
    const existingTitles = newArray.map((entry) => { return entry.title; })
    if (!existingTitles.includes(event.title)) {
      newArray.push(event);
      this.setState({ selectedTags: newArray });
    }
  }

  render(){
    return (
      <MultiSelect2
      className={'tagsHolder'}
      itemPredicate={this.state.tagsFilter}
      itemRenderer={this.renderSelection}
      items={this.state.tags}
      onItemSelect={this.setSelectedTag}
      onRemove={(tagToRemove) => {
        this.setState({ selectedTags: this.state.selectedTags.filter(tag => tag !== tagToRemove)})
      }}
      menuProps={{ "aria-label": "tags" }}
      placeholder={'All Topics'}
      resetOnSelect={this.clearTags}
      selectedItems={this.state.selectedTags}
      tagRenderer={(item) => { return item.title; }}
    />
    )
  }
}

export default TabSidebar