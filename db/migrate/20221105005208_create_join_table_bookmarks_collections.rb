class CreateJoinTableBookmarksCollections < ActiveRecord::Migration[6.0]
  def change
    create_join_table :bookmarks, :collections do |t|
      t.index [:bookmark_id, :collection_id]
      t.index [:collection_id, :bookmark_id]
    end
  end
end
