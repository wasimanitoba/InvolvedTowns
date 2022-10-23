# frozen_string_literal: true

Rails.application.routes.draw do
  devise_for :users
  mount Thredded::Engine => '/home'

  resources :users do
    resources :tags
  end
  
  get '/library', to: 'stackbiblio#index'
  get '/stack', to: 'stackbiblio#stack'
  get '/me', to: 'users#me', as: :me
  get '/about', to: 'home#index'
  root to: redirect('/home')
end
