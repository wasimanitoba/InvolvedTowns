class CreateJoinTableLinkedTags < ActiveRecord::Migration[6.0]
  def change
    create_table :linked_tags do |t|
      t.references :subject, foreign_key: {to_table: :tags}, null: false
      t.references :object, foreign_key: {to_table: :tags}, null: false
      t.string :predicate, null: false
    end
  end
end
