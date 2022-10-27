class Admin::PostsController < ApplicationController
  def index
    @posts = Thredded.posts_page_view(scope: Thredded::Post.where(user: params[:user_id]), current_user: current_user)
  end
end
