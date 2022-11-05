require 'rails_helper'

RSpec.describe "reminders/index", type: :view do
  before(:each) do
    assign(:reminders, [
      Reminder.create!(
        excerpt: "Excerpt",
        user: nil,
        reminder_type: "Type"
      ),
      Reminder.create!(
        excerpt: "Excerpt",
        user: nil,
        reminder_type: "Reminder Type"
      )
    ])
  end

  it "renders a list of reminders" do
    render
    assert_select "tr>td", text: "Excerpt".to_s, count: 2
    assert_select "tr>td", text: nil.to_s, count: 2
    assert_select "tr>td", text: "Reminder type".to_s, count: 2
  end
end
