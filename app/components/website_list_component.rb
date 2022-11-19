# frozen_string_literal: true

class WebsiteListComponent < ViewComponent::Base
  attr_reader :placeholder_text, :submit_button, :wlc_form_model

  def initialize(model: :bookmark, placeholder: 'Add websites', submit_button: false)
    super

    @wlc_form_model   = model
    @placeholder_text = placeholder
    @submit_button    = submit_button
  end
end
