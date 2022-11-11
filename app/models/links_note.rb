class LinksNote < ApplicationRecord
  belongs_to :note
  belongs_to :link
end