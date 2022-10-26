# frozen_string_literal: true

class ChangeTagField < ActiveRecord::Migration[6.0]
  def change
    change_column :tags, :tag_id, :bigint, null: true
  end
end
