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
  validates :url, uniqueness: { scope: :user_id }, on: :create
  validates :url, presence: true, on: :create
  validate :check_url_format, on: :create

  def check_url_format
    clean_url

    errors.add(:url, 'Must have no empty spaces.') if url.match(/\s/)
    errors.add(:url, 'Must be in format `website.com`') unless url.match(/\S+\.\S+/)
  end

  # like a normal save, but also returns false if a constraint failed
  def save_with_constraints
    save
  rescue ValidationRaceCondition
    # re-run validations to set a user-friendly error mesage for whatever the
    # validation missed the first time but the constraints caught
    valid?
    false
  end

  belongs_to :user

  has_many :bookmarks_notes, dependent: :destroy
  has_many :notes, through: :bookmarks_notes, dependent: :restrict_with_exception

  def clean_url
    self.url = url.strip.gsub(%r{http://|https://}, '').gsub('www.', '')
  end

  def to_s
    "#{title.present? ? "#{title}:" : ''}#{url}"
  end
end
