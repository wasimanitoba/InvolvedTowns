import Dexie from 'dexie'
import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ['content']
  static values  = { user: String }

  connect() {
    this.db = new Dexie('stackbiblio-entries')
    this.db.version(1).stores({ entries: '++id, content, timestamp' });
  }

  /**
   * @param {*} event 
   */
  async exportPostFromForumToDB(event) {
    event.preventDefault();
    // We will export the post with a couple modifications to metadata
    let post       = JSON.parse(event.currentTarget.dataset.entry).post
    post.timestamp = post.created_at;
    const form     = event.currentTarget;
    let tags       = form.querySelector('input').value.split(',').map((tag)=> { 
      return { title: tag.trim(), category: '' } 
    });
    let notes      = form.querySelector('textarea').value;
    
    if (post.tags) { post.tags.concat(tags); }
    else           { post.tags = tags; }

    // We check for an existing note with the same user, messageboard and post ID
    // In the future, we can also check for the hash of the content to identify duplicates?
    post.id = `${post.user_id}-${post.messageboard_id}-${post.id}`;
    let currentEntry = await this.db.entries.get(post.id);

    if (!currentEntry) {
      await this.db.entries.add(post);
    }
    else {
      alert('This note already exists!')
    }

    form.querySelector('input').value = "";
    form.querySelector('textarea').value = "";
  }
}