# == Schema Information
#
# Table name: reminders
#
#  id            :bigint           not null, primary key
#  due           :datetime
#  excerpt       :string
#  reminder_type :string
#  created_at    :datetime         not null
#  updated_at    :datetime         not null
#  user_id       :bigint           not null
#
# Indexes
#
#  index_reminders_on_user_id  (user_id)
#
# Foreign Keys
#
#  fk_rails_...  (user_id => users.id)
#
class Reminder < ApplicationRecord
  belongs_to :user
end
