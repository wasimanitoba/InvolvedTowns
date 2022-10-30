# frozen_string_literal: true

require 'rails_helper'

RSpec.describe TagsController, type: :routing do
  pending 'Nested routes not updated here yet' do
    let(:user) { User.create!(password: 'fakepassword', email: 'fake@fake.com', name: 'fake name') }

    before do
      sign_in(user)
    end

    it 'routes to #index', auto: false do
      expect(get: user_tags_path(user_id: user.id)).to route_to('tags#index', user_id: user.id.to_s)
    end

    it 'routes to #new' do
      expect(get: '/tags/new').to route_to('tags#new')
    end

    it 'routes to #show' do
      expect(get: '/tags/1').to route_to('tags#show', id: '1')
    end

    it 'routes to #edit' do
      expect(get: '/tags/1/edit').to route_to('tags#edit', id: '1')
    end

    it 'routes to #create' do
      expect(post: '/tags').to route_to('tags#create')
    end

    it 'routes to #update via PUT' do
      expect(put: '/tags/1').to route_to('tags#update', id: '1')
    end

    it 'routes to #update via PATCH' do
      expect(patch: '/tags/1').to route_to('tags#update', id: '1')
    end

    it 'routes to #destroy' do
      expect(delete: '/tags/1').to route_to('tags#destroy', id: '1')
    end
  end
end
