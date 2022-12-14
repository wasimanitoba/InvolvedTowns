# frozen_string_literal: true

require 'rails_helper'

RSpec.describe 'tags/edit', type: :view do
  before do
    user = User.create!(email: 'fake@fake.com', password: 'example', name: 'test user')
    tag  = Tag.create!(title: 'Title', user: user)
    @tag = assign(:tag, tag)
    sign_in user
  end

  pending 'renders the edit tag form' do
    render

    assert_select 'form[action=?][method=?]', user_tag_path(user_id: @tag.user_id, id: @tag.id), 'post' do
      assert_select 'input[name=?]', 'tag[title]'

      assert_select 'input[name=?]', 'tag[tag_id]'

      assert_select 'input[name=?]', 'tag[user_id]'
    end
  end
end
