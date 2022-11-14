# frozen_string_literal: true

class StackController < ApplicationController
  def messaging
    @hide_chat = true
    @page_name = 'chat-body-class'
  end
end
