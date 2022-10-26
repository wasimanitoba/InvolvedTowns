class AddIriStringToTags < ActiveRecord::Migration[6.0]
  def change
    add_column :tags, :iri_string, :string
  end
end
