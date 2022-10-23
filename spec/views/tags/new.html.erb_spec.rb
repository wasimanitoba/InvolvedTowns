# frozen_string_literal: true

require 'rails_helper'

RSpec.describe 'tags/new', type: :view do
  before(:each) do
    assign(:tag, Tag.new(title: 'MyString', user: nil))
  end

  it 'renders new tag form' do
    render

    assert_select 'form[action=?][method=?]', tags_path, 'post' do
      assert_select 'input[name=?]', 'tag[title]'

      assert_select 'input[name=?]', 'tag[tag_id]'

      assert_select 'input[name=?]', 'tag[user_id]'
    end
  end
end
