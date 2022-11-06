# frozen_string_literal: true

module Thredded
  # @api private
  module NewTopicParams
    protected

    def new_topic_params
      mergeable   = { messageboard: messageboard, user: thredded_current_user }
      permissable = %i[title websites locked sticky content]

      params.fetch(:topic, {}).permit(*permissable, category_ids: []).merge(**mergeable)
    end
  end
end
