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

  get '/library', to: 'library#index', as: :library

  scope('/stack') do
    get '/import', to: 'stack#import', as: :notes_import
    post '/import', to: 'bookmarks#bulk_upload', as: :bookmarks_import
    get '/list', to: 'stack#list', as: :offline_note_list
    get '/sync', to: 'stack#sync', as: :sync_library
    get '/', to: 'stack#index'
  end

  get '/messaging', to: 'stack#messaging', as: :messages
  get '/about', to: 'home#index'
  get '/me', to: 'users#me', as: :me
  root to: redirect('/home')
end
