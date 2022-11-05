class CreateJoinTableNotesReminders < ActiveRecord::Migration[6.0]
  def change
    create_join_table :notes, :reminders do |t|
      t.index [:note_id, :reminder_id]
      t.index [:reminder_id, :note_id]
    end
  end
end
