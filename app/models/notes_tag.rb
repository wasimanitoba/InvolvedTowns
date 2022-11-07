# == Schema Information
#
# Table name: notes_tags
#
#  note_id :bigint
#  tag_id  :bigint
#
# Foreign Keys
#
#  fk_rails_...  (note_id => notes.id)
#  fk_rails_...  (tag_id => tags.id)
#
class NotesTag < ApplicationRecord
  belongs_to :notes
  belongs_to :tags
end
