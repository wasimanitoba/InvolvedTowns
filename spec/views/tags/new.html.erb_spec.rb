# frozen_string_literal: true

require 'rails_helper'

RSpec.describe 'tags/new', type: :view do
  let(:user) { User.create!(email: 'fake2@fake.com', password: 'example', name: 'test user') }
  let(:tag)  { Tag.new(title: 'MyString', user: user) }

  before(:each) do
    assign(:tag, tag)
    sign_in user
  end

  pending 'renders new tag form' do
    render

    assert_select 'form[action=?][method=?]', user_tags_path(user_id: tag.user_id), 'post' do
      assert_select 'input[name=?]', 'tag[title]'

      assert_select 'input[name=?]', 'tag[tag_id]'

      assert_select 'input[name=?]', 'tag[user_id]'
    end
  end
end
