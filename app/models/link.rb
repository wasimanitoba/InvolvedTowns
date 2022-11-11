# frozen_string_literal: true

# == Schema Information
#
# Table name: links
#
#  id         :bigint           not null, primary key
#  query      :string
#  url        :string
#  created_at :datetime         not null
#  updated_at :datetime         not null
#  user_id    :bigint           not null
#
# Indexes
#
#  index_links_on_user_id  (user_id)
#
# Foreign Keys
#
#  fk_rails_...  (user_id => users.id)
#
class Link < ApplicationRecord
  belongs_to :user

  has_many :notes, through: :links_notes, dependent: :restrict_with_exception
  has_many :links_notes, dependent: :destroy
end
