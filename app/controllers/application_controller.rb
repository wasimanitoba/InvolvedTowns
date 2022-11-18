# frozen_string_literal: true

class ApplicationController < ActionController::Base
  before_action do
    @annotation = Note.new(user_id: current_user)
  end
end
