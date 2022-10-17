import Dexie from 'dexie'
import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ['content']
  static values  = { entry: Object }
  connect() {
    this.db = new Dexie('stackbiblio-entries')
    this.db.version(1).stores({ entries: '++id, content, timestamp' });
  }
  async export_post_from_forum_to_db(_event) {
    let post = this.entryValue.post;
    post.timestamp = post.created_at;
    if (!post.tags) { post.tags = [] }
    post.id = `${post.user_id}-${post.messageboard_id}-${post.id}`;
    let currentEntry = await this.db.entries.get(post.id);
    if (!currentEntry) {
      await this.db.entries.add(post);
    }
    else{
      alert('This note already exists!')
    }
  }
}