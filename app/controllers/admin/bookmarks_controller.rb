# frozen_string_literal: true

class Admin::BookmarksController < ApplicationController
  before_action :set_bookmark, only: %i[show edit update destroy]

  # GET /bookmarks or /bookmarks.json
  def index
    @bookmarks = Bookmark.all
  end

  # GET /bookmarks/1 or /bookmarks/1.json
  def show; end

  # GET /bookmarks/new
  def new
    @bookmark = Bookmark.new
  end

  def bulk_upload
    sites = remote_link_params[:websites].split(/\n|,/)

    successfully_saved_all_links = sites.all? do |site|
      @bookmark = Bookmark.create(url: site, user_id: current_user.id)
      @bookmark.save
    end
    respond_to do |format|
      if successfully_saved_all_links
        format.html { redirect_to user_bookmarks_url(current_user), notice: 'Link was successfully created.' }
        format.json { render :show, status: :created, location: @bookmark }
      else
        format.html { render :new, status: :unprocessable_entity }
        format.json { render json: { msg: 'error not implemented' }, status: :unprocessable_entity }
      end
    end
  end

  # GET /bookmarks/1/edit
  def edit; end

  # POST /bookmarks or /bookmarks.json
  def create
    @bookmark = Bookmark.new(bookmark_params)

    respond_to do |format|
      if @bookmark.save
        format.html { redirect_to bookmark_url(@bookmark), notice: 'Bookmark was successfully created.' }
        format.json { render :show, status: :created, location: @bookmark }
      else
        format.html { render :new, status: :unprocessable_entity }
        format.json { render json: @bookmark.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /bookmarks/1 or /bookmarks/1.json
  def update
    respond_to do |format|
      if @bookmark.update(bookmark_params)
        format.html { redirect_to bookmark_url(@bookmark), notice: 'Bookmark was successfully updated.' }
        format.json { render :show, status: :ok, location: @bookmark }
      else
        format.html { render :edit, status: :unprocessable_entity }
        format.json { render json: @bookmark.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /bookmarks/1 or /bookmarks/1.json
  def destroy
    @bookmark.destroy

    respond_to do |format|
      format.html { redirect_to user_bookmarks_url, notice: 'Bookmark was successfully destroyed.' }
      format.json { head :no_content }
    end
  end

  private

  # Use callbacks to share common setup or constraints between actions.
  def set_bookmark
    @bookmark = Bookmark.find(params[:id])
  end

  # Only allow a list of trusted parameters through.
  def bookmark_params
    params.require(:bookmark).permit(:url, :title, :user_id)
  end

    # for remote forms
    def remote_link_params
      params.require(:bookmark).permit(:url, :title, :user_id, :websites)
    end
end
