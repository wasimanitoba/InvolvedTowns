import PouchDB from 'pouchdb';
import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static values  = { user: String }

  connect() {
    this.db    = new PouchDB('stackbiblio-development');
    this.tagDB = new PouchDB('tag-store-development');
  }

  /**
   * @param {*} event
   */
  async exportPostFromForumToDB(event) {
    event.preventDefault();
    // We will export the post with a couple modifications to metadata
    let post       = JSON.parse(event.currentTarget.dataset.entry).post
    post.timestamp = JSON.stringify(post.created_at);
    const form     = event.currentTarget;
    let tags       = form.querySelector('input').value
                         .split(',')
                         .map((tag)=>    { return { title: tag.trim(), category: '' }  })
                         .filter((tag)=> { return tag.title !== '';                    });

    const noteText = form.querySelector('textarea').value;
    if (noteText !== '') { post.notes = noteText; }

    if (post.tags) { post.tags.concat(tags);}
    else           { post.tags = tags; }


    // We check for an existing note with the same user, messageboard and post ID
    // In the future, we can also check for the hash of the content to identify duplicates?
    post._id = `${post.user_id}-${post.messageboard_id}-${post.id}`;
    this.db.put(post).then((result)=>{
      console.log('added post to stack', result);
    })


    // ..... do a better job here
    form.querySelector('input').value      = post.tags.map((tag)=>{ return tag.title; }).join(', ');
    form.querySelector('textarea').value   = noteText;
    form.querySelector('button').innerHTML = 'Saved!'
    setTimeout(()=>{ form.querySelector('button').innerHTML = 'Update Entry'; }, 2500)
  }
}