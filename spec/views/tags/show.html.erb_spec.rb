# frozen_string_literal: true

require 'rails_helper'

RSpec.describe 'tags/show', type: :view do
  before(:each) do
    user = User.create!(email: 'fake@fake.com', password: 'example', name: 'test user')
    tag  = Tag.create!(title: 'Title', user: user)
    @tag = assign(:tag, tag)
  end

  it 'renders attributes in <p>' do
    render
    expect(rendered).to match(/Title/)
    expect(rendered).to match(//)
    expect(rendered).to match(//)
  end
end
