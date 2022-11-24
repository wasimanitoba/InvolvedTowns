class CreateBookmarksNoteJoinTable < ActiveRecord::Migration[6.0]
  def change
    create_join_table :bookmarks, :notes do |t|
      t.index %i[bookmark_id note_id]
      t.index %i[note_id bookmark_id]
    end

    add_foreign_key 'bookmarks_notes', 'bookmarks'
    add_foreign_key 'bookmarks_notes', 'notes'
  end
end
