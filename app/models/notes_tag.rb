class NotesTag < ApplicationRecord
  belongs_to :notes
  belongs_to :tags
end