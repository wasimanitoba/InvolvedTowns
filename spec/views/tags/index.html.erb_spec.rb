# frozen_string_literal: true

require 'rails_helper'

RSpec.describe 'tags/index', type: :view do
  before(:each) do
    user = User.create!(email: 'fake@fake.com', password: 'example', name: 'test user')
    assign(:tags, [Tag.create!(title: 'Title', user: user), Tag.create!(title: 'Title', user: user)])
  end

  it 'renders a list of tags' do
    render
    assert_select 'tr>td', text: 'Title'.to_s, count: 2
    assert_select 'tr>td', text: nil.to_s, count: 2
    assert_select 'tr>td', text: nil.to_s, count: 2
  end
end
