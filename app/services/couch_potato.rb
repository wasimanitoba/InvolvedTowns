# Class for accessing our CouchDB instance
class CouchPotato
  include HTTParty

  base_uri 'localhost:5984'
  ADMIN_URL = "http://#{ENV.fetch('COUCH_USERNAME')}:#{ENV.fetch('COUCH_PASSWORD')}@localhost:5984".freeze

  # Can we create a session for the user on the server which is persisted locally?
  # def initialize(payload = {}, password = nil, username = nil)
  def initialize(payload = {})
    @payload = payload
  end

  def put(path)
    self.class.put("#{ADMIN_URL}/#{path}", body: payload)
  end

  private

  def payload
    JSON.generate(@payload)
  end
end
