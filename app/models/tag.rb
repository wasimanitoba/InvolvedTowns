# frozen_string_literal: true

# == Schema Information
#
# Table name: tags
#
#  id         :bigint           not null, primary key
#  path       :ltree
#  title      :string
#  created_at :datetime         not null
#  updated_at :datetime         not null
#  tag_id     :bigint
#  user_id    :bigint           not null
#
# Indexes
#
#  index_tags_on_path     (path) USING gist
#  index_tags_on_tag_id   (tag_id)
#  index_tags_on_user_id  (user_id)
#
# Foreign Keys
#
#  fk_rails_...  (tag_id => tags.id)
#  fk_rails_...  (user_id => users.id)
#
class Tag < ApplicationRecord
  # has_many :tag
  belongs_to :user
end
