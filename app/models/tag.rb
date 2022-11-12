# frozen_string_literal: true

# == Schema Information
#
# Table name: tags
#
#  id         :bigint           not null, primary key
#  title      :string
#  created_at :datetime         not null
#  updated_at :datetime         not null
#  user_id    :bigint           not null
#
# Indexes
#
#  index_tags_on_title_and_user_id  (title,user_id) UNIQUE
#  index_tags_on_user_id            (user_id)
#
# Foreign Keys
#
#  fk_rails_...  (user_id => users.id)
#
class Tag < ApplicationRecord
  validates :title, uniqueness: { scope: :user_id }
  validates_presence_of :title

  has_many :subject_links, foreign_key: :subject_id, class_name: 'LinkedTag', dependent: :destroy, inverse_of: :subject
  has_many :object_links, foreign_key: :object_id, class_name: 'LinkedTag', dependent: :destroy, inverse_of: :object

  has_many :objects, through: :subject_links, dependent: :destroy
  has_many :subjects, through: :object_links, dependent: :destroy

  accepts_nested_attributes_for :subjects, :objects

  delegate :to_s, to: :title

  belongs_to :user

  # Retrieves `subjects` of this tag whose linked_tag intermediate model has the corresponding `relationship`
  def subjects_with_predicate(relationship = nil)
    links          = LinkedTag.select(:subject_id, :predicate).where(id: object_links)
    filtered_links = relationship.nil? ? links : links.filter { |link| link.predicate == relationship }

    filtered_links.map do |current_link|
      current_predicate = current_link.predicate
      current_subject   = subjects.find(current_link.subject_id)

      { subject: current_subject, relationship: current_predicate }
    end
  end
end
