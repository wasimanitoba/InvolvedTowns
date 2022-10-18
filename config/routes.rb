# frozen_string_literal: true

Rails.application.routes.draw do
  devise_for :users
  mount Thredded::Engine => '/forum'

  resources :users
  get '/library', to: 'stackbiblio#index'
  get '/me', to: 'users#me', as: :me
  get '/about', to: 'home#index'
  root to: Thredded::Engine
  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html
end
