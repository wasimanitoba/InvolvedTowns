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
require 'rails_helper'

RSpec.describe Tag, type: :model do
  pending "add some examples to (or delete) #{__FILE__}"
end
