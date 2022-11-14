# frozen_string_literal: true

# == Schema Information
#
# Table name: bookmarks_notes
#
#  bookmark_id :bigint           not null
#  note_id     :bigint           not null
#
# Indexes
#
#  index_bookmarks_notes_on_bookmark_id_and_note_id  (bookmark_id,note_id)
#  index_bookmarks_notes_on_note_id_and_bookmark_id  (note_id,bookmark_id)
#
# Foreign Keys
#
#  fk_rails_...  (bookmark_id => bookmarks.id)
#  fk_rails_...  (note_id => notes.id)
#
class BookmarksNote < ApplicationRecord
  belongs_to :note
  belongs_to :link
end
