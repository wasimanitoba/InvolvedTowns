# frozen_string_literal: true

require 'rails_helper'

RSpec.describe 'tags/show', type: :view do
  before(:each) do
    tag = Tag.create!(
      title: 'Title',
      tag: nil,
      user: nil
    )
    @tag = assign(:tag, tag)
  end

  it 'renders attributes in <p>' do
    render
    expect(rendered).to match(/Title/)
    expect(rendered).to match(//)
    expect(rendered).to match(//)
  end
end
