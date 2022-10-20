require 'rails_helper'

RSpec.describe "tags/index", type: :view do
  before(:each) do
    assign(:tags, [
      Tag.create!(
        title: "Title",
        tag: nil,
        user: nil
      ),
      Tag.create!(
        title: "Title",
        tag: nil,
        user: nil
      )
    ])
  end

  it "renders a list of tags" do
    render
    assert_select "tr>td", text: "Title".to_s, count: 2
    assert_select "tr>td", text: nil.to_s, count: 2
    assert_select "tr>td", text: nil.to_s, count: 2
  end
end
