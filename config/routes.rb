# frozen_string_literal: true

Rails.application.routes.draw do
  devise_for :users, controllers: { sessions: 'users/sessions' }
  resources :notes do
    resources :tags
  end
  mount Thredded::Engine => '/home'

  namespace :admin do
    resources :users do
      resources :tags
      resources :links
      resources :collections
      resources :bookmarks
      resources :reminders
      resources :notes
      resources :posts
    end

    resources :tags
    resources :links
    resources :collections
    resources :bookmarks
    resources :reminders
    resources :notes
    resources :posts
  end

  resources :tags do
    resources :notes
  end

  resources :users do
    resources :tags
    resources :links
    resources :collections
    resources :bookmarks
    resources :reminders
    resources :notes
    resources :posts
  end

  get '/library', to: 'stackbiblio#index'
  get '/messaging', to: 'stackbiblio#messaging', as: :messages
  get '/me', to: 'users#me', as: :me
  get '/about', to: 'home#index'
  root to: redirect('/home')
end
