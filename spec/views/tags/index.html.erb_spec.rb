# frozen_string_literal: true

require 'rails_helper'

RSpec.describe 'tags/index', type: :view do
  before(:each) do
    user = User.create!(email: 'fake@fake.com', password: 'example', name: 'test user')
    assign(:tags, [Tag.create!(title: 'title_1', user: user), Tag.create!(title: 'title_2', user: user)])
  end

  it 'renders a list of tags' do
    render
    assert_select 'tr>td', text: 'title_1', count: 1
    assert_select 'tr>td', text: 'title_2', count: 1
  end
end
