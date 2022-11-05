require 'rails_helper'

RSpec.describe "reminders/new", type: :view do
  before(:each) do
    assign(:reminder, Reminder.new(
      excerpt: "MyString",
      user: nil,
      reminder_type: ""
    ))
  end

  it "renders new reminder form" do
    render

    assert_select "form[action=?][method=?]", reminders_path, "post" do

      assert_select "input[name=?]", "reminder[excerpt]"

      assert_select "input[name=?]", "reminder[user_id]"

      assert_select "input[name=?]", "reminder[type]"
    end
  end
end
