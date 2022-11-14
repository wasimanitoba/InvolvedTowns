# frozen_string_literal: true

class WebsiteListComponent < ViewComponent::Base
  attr_reader :placeholder_text, :submit_button

  def initialize(placeholder: 'Add websites', submit_button: false)
    super

    @placeholder_text = placeholder
    @submit_button    = submit_button
  end
end
