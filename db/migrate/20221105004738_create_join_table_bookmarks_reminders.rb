class CreateJoinTableBookmarksReminders < ActiveRecord::Migration[6.0]
  def change
    create_join_table :bookmarks, :reminders do |t|
      t.index [:bookmark_id, :reminder_id]
      t.index [:reminder_id, :bookmark_id]
    end
  end
end
