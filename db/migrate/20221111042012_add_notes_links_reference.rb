# frozen_string_literal: true

class AddNotesLinksReference < ActiveRecord::Migration[6.0]
  def change
    add_foreign_key 'links_notes', 'notes'
    add_foreign_key 'links_notes', 'links'
  end
end
