# frozen_string_literal: true

module Admin
  class PostsController < ApplicationController
    def index
      scope  = params[:user_id] ? Thredded::Post.where(user: params[:user_id]) : Thredded::Post.all
      @posts = Thredded.posts_page_view(scope: scope, current_user: current_user)
    end
  end
end
