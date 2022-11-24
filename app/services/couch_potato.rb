# Class for accessing our CouchDB instance
class CouchPotato
  include HTTParty

  base_uri 'localhost:5984'
  ADMIN_URL = "http://#{ENV.fetch('COUCH_USERNAME') { 'COUCH' }}:#{ENV.fetch('COUCH_PASSWORD') { 'POTATO' }}@localhost:5984".freeze

  # Can we create a session for the user on the server which is persisted locally?
  def initialize(payload = {})
    @payload = payload
  end

  def put(path)
    self.class.put("#{ADMIN_URL}/#{path}", body: payload)
  rescue Errno::ECONNREFUSED
    Rails.logger.fatal('Could not connect!')
  end

  private

  def payload
    JSON.generate(@payload)
  end
end
