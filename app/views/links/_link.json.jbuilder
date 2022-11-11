# frozen_string_literal: true

json.extract! link, :id, :title, :content, :user_id, :created_at, :updated_at
json.url link_url(link, format: :json)
