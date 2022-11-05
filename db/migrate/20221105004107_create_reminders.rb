class CreateReminders < ActiveRecord::Migration[6.0]
  def change
    create_table :reminders do |t|
      t.datetime :due
      t.string :excerpt
      t.references :user, null: false, foreign_key: true
      t.string :type

      t.timestamps
    end
  end
end
