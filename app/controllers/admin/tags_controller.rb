# frozen_string_literal: true

module Admin
  class TagsController < ApplicationController
    before_action :set_tag, only: %i[show edit update destroy]

    # GET /tags or /tags.json
    def index
      @tags = Tag.all
    end

    private

    # Use callbacks to share common setup or constraints between actions.
    def set_tag
      @tag = Tag.find(params[:id])
    end
  end
end
