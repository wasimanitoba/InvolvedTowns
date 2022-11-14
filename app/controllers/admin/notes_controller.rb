# frozen_string_literal: true

class NotesController < ApplicationController
  before_action :set_note, only: %i[show edit update destroy]
  load_and_authorize_resource

  # GET /notes or /notes.json
  def index
    @notes = filter_optionally(Note.all, :links, :related_link)
  end

  # GET /notes/1 or /notes/1.json
  def show; end

  # GET /notes/new
  def new
    @note = Note.new
  end

  # GET /notes/1/edit
  def edit; end

  # POST /notes or /notes.json
  def create
    current_params = note_params
    tag_attributes = current_params.delete(:tags)
    @note          = Note.new(current_params)

    if tag_attributes.present?
      tags = tag_attributes.map { |tag| { user_id: tag[:user_id], title: tag[:title] } }
      @note.tags << tags.map { |tag| Tag.create!(tag) }
    end

    respond_to do |format|
      if @note.save
        format.html { redirect_to note_url(@note), notice: 'Note was successfully created.' }
        format.json { render :show, status: :created, location: @note }
      else
        format.html { render :new, status: :unprocessable_entity }
        format.json { render json: @note.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /notes/1 or /notes/1.json
  def update
    respond_to do |format|
      if @note.update(note_params)
        format.html { redirect_to note_url(@note), notice: 'Note was successfully updated.' }
        format.json { render :show, status: :ok, location: @note }
      else
        format.html { render :edit, status: :unprocessable_entity }
        format.json { render json: @note.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /notes/1 or /notes/1.json
  def destroy
    @note.destroy

    respond_to do |format|
      format.html { redirect_to notes_url, notice: 'Note was successfully destroyed.' }
      format.json { head :no_content }
    end
  end

  private

  def filter_optionally(collection, filter_field, param_name)
    user_input = params[param_name]
    return collection if user_input.blank?

    filter_params = {}

    filter_params[filter_field] = { id: user_input }

    collection.joins(filter_field).where(**filter_params)
  end

  # Use callbacks to share common setup or constraints between actions.
  def set_note
    @note = Note.find(params[:id])
  end

  # Only allow a list of trusted parameters through.
  def note_params
    initial_params                = params.require(:note).permit(:user_id, :title, :content, :tags)
    associated_tags_for_this_note = initial_params.delete(:tags)

    return initial_params if associated_tags_for_this_note.blank?

    initial_params[:tags] = associated_tags_for_this_note.split(',').map do |tag|
      { user_id: current_user.id, title: tag }
    end
  end
end
