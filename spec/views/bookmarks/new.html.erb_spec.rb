require 'rails_helper'

RSpec.describe "bookmarks/new", type: :view do
  before(:each) do
    assign(:bookmark, Bookmark.new(
      url: "MyString",
      title: "MyString",
      user: nil
    ))
  end

  it "renders new bookmark form" do
    render

    assert_select "form[action=?][method=?]", bookmarks_path, "post" do

      assert_select "input[name=?]", "bookmark[url]"

      assert_select "input[name=?]", "bookmark[title]"

      assert_select "input[name=?]", "bookmark[user_id]"
    end
  end
end
