# frozen_string_literal: true

Rails.application.routes.draw do
  devise_for :users, controllers: { sessions: 'users/sessions' }
  mount Thredded::Engine => '/home'

  get '/admin', to: 'admin#index'

  namespace :admin do
    resources :tags, :collections, :bookmarks, :reminders, :notes, :posts

    resources :users do
      resources :tags, :collections, :bookmarks, :reminders, :notes, :posts
    end
  end

  resources :users do
    resources :tags, :collections, :bookmarks, :reminders, :notes, :posts
  end

  scope('/library') do
    get '/import', to: 'stackbiblio#import', as: :notes_import
    post '/import', to: 'bookmarks#bulk_upload'
    get '/cloud', to: 'stackbiblio#cloud_library', as: :cloud_library
    get '/list', to: 'stackbiblio#list', as: :offline_note_list
    get '/sync', to: 'stackbiblio#sync', as: :sync_library
    get '/', to: 'stackbiblio#index'
  end

  get '/messaging', to: 'stackbiblio#messaging', as: :messages
  get '/me', to: 'users#me', as: :me
  get '/about', to: 'home#index'
  root to: redirect('/home')
end
