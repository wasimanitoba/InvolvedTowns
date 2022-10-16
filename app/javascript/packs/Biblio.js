import React from 'react';

class BiblioEntry extends React.Component { 
  constructor(props) {
    super(props);
    this.state = { 
      content: props.entry.content,
      tags: props.entry.tags
     };
  }
  render() {
    return (
      <li>{this.state.content} <sub hidden><sup>{this.state.tags.map((tag)=>{return `${tag.title} ${tag.category}`})}</sup></sub></li>
    )
  }
}

class Biblio extends React.Component { 
  constructor(props) {
    super(props)
    this.state = { entries: props.entries };
  }
  render() {
    return (
      <div>
        <div id="entries">
          <ul data-filter-list>
            { this.state.entries.map((entry)=> { 
              return <BiblioEntry entry={entry} key={entry.id} /> 
            })}
          </ul>
          {/* <p data-filter-empty-state hidden>0 entries found.</p> */}
        </div>
      </div>
    )
  }
}
  
export default Biblio