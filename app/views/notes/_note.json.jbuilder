# frozen_string_literal: true

json.extract! note, :id, :user_id, :title, :content, :created_at, :updated_at
json.url note_url(note, format: :json)
