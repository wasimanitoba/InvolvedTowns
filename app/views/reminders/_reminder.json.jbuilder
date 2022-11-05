json.extract! reminder, :id, :due, :excerpt, :user_id, :type, :created_at, :updated_at
json.url reminder_url(reminder, format: :json)
