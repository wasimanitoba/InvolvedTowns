# frozen_string_literal: true

# Migration
class AddLtreeToModel < ActiveRecord::Migration[6.0]
  def change
    add_column :tags, :path, :ltree
    add_index :tags, :path, using: :gist
  end
end
