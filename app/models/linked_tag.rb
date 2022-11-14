# frozen_string_literal: true

# == Schema Information
#
# Table name: linked_tags
#
#  id         :bigint           not null, primary key
#  predicate  :string           not null
#  object_id  :bigint           not null
#  subject_id :bigint           not null
#
# Indexes
#
#  index_linked_tags_on_object_id   (object_id)
#  index_linked_tags_on_subject_id  (subject_id)
#
# Foreign Keys
#
#  fk_rails_...  (object_id => tags.id)
#  fk_rails_...  (subject_id => tags.id)
#
class LinkedTag < ApplicationRecord
  validates :predicate, presence: true

  belongs_to :object, class_name: 'Tag', inverse_of: :objects
  belongs_to :subject, class_name: 'Tag', inverse_of: :subjects
end
