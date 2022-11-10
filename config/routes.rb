# frozen_string_literal: true

Rails.application.routes.draw do
  resources :collections
  resources :bookmarks
  resources :reminders
  resources :notes
  devise_for :users, controllers: { sessions: 'users/sessions' }
  mount Thredded::Engine => '/home'

  namespace :admin do
    resources :users do
      resources :tags
      resources :posts
    end

    resources :tags

    resources :posts
  end

  resources :users do
    resources :tags
  end

  get '/library', to: 'stackbiblio#index'
  get '/messaging', to: 'stackbiblio#messaging', as: :messages
  get '/me', to: 'users#me', as: :me
  get '/about', to: 'home#index'
  root to: redirect('/home')
end
