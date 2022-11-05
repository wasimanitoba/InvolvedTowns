require 'rails_helper'

RSpec.describe "reminders/show", type: :view do
  before(:each) do
    @reminder = assign(:reminder, Reminder.create!(
      excerpt: "Excerpt",
      user: nil,
      reminder_type: "Reminder type"
    ))
  end

  it "renders attributes in <p>" do
    render
    expect(rendered).to match(/Excerpt/)
    expect(rendered).to match(//)
    expect(rendered).to match(/Reminder Type/)
  end
end
