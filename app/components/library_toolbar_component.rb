# frozen_string_literal: true

class LibraryToolbarComponent < ViewComponent::Base
  attr_reader :active_user

  def initialize(active_user: false)
    super

    @active_user = active_user
  end
end
