# frozen_string_literal: true

class StackbiblioController < ApplicationController
  def messaging
    @hide_chat = true
    @page_name = 'chat-body-class'
  end

  def cloud_library; end
end
