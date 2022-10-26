# frozen_string_literal: true

class MakeTagTitleMandatory < ActiveRecord::Migration[6.0]
  def change
    change_column :tags, :title, :string, null: false
  end
end
