# frozen_string_literal: true

# == Schema Information
#
# Table name: bookmarks
#
#  id         :bigint           not null, primary key
#  title      :string
#  url        :string
#  created_at :datetime         not null
#  updated_at :datetime         not null
#  user_id    :bigint           not null
#
# Indexes
#
#  index_bookmarks_on_url_and_user_id  (url,user_id) UNIQUE
#  index_bookmarks_on_user_id          (user_id)
#
# Foreign Keys
#
#  fk_rails_...  (user_id => users.id)
#
class Bookmark < ApplicationRecord
  validates :url, uniqueness: { scope: :user_id }
  validates :url, presence: true

  belongs_to :user

  has_many :bookmarks_notes, dependent: :destroy
  has_many :notes, through: :bookmarks_notes, dependent: :restrict_with_exception

  def to_s
    "#{title.present? ? "#{title}:" : ''}#{url}"
  end
end
