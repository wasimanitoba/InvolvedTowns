class RemoveLinksNote < ActiveRecord::Migration[6.0]
  def change
    drop_table :links_notes
    drop_table :links
  end
end
