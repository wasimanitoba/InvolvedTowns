# frozen_string_literal: true

# == Schema Information
#
# Table name: links_notes
#
#  link_id :bigint           not null
#  note_id :bigint           not null
#
# Indexes
#
#  index_links_notes_on_link_id_and_note_id  (link_id,note_id)
#  index_links_notes_on_note_id_and_link_id  (note_id,link_id)
#
# Foreign Keys
#
#  fk_rails_...  (link_id => links.id)
#  fk_rails_...  (note_id => notes.id)
#
class LinksNote < ApplicationRecord
  belongs_to :note
  belongs_to :link
end
