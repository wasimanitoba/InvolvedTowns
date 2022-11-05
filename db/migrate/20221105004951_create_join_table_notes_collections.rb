class CreateJoinTableNotesCollections < ActiveRecord::Migration[6.0]
  def change
    create_join_table :notes, :collections do |t|
      t.index [:note_id, :collection_id]
      t.index [:collection_id, :note_id]
    end
  end
end
