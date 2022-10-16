# frozen_string_literal: true

Rails.application.routes.draw do
  devise_for :users
  mount Thredded::Engine => '/forum'
  resources :users
  get '/library', to: 'stackbiblio#index'
  root to: 'home#index'
  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html
end
