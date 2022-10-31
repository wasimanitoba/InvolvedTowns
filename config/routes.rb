# frozen_string_literal: true

Rails.application.routes.draw do
  devise_for :users
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

  scope '/library' do
    get '/compose', to: 'stackbiblio#new'
    get '/', to: 'stackbiblio#library'
  end

  get '/messaging', to: 'stackbiblio#messaging', as: :messages
  get '/me', to: 'users#me', as: :me
  get '/about', to: 'home#index'
  root to: redirect('/home')
end
