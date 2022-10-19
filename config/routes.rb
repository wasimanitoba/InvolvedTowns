# frozen_string_literal: true

Rails.application.routes.draw do
  devise_for :users
  mount Thredded::Engine => '/home'

  resources :users
  get '/library', to: 'stackbiblio#index'
  get '/me', to: 'users#me', as: :me
  get '/about', to: 'home#index'
  root to: redirect('/home')
end
