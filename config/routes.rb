Rails.application.routes.draw do
  devise_for :users

  devise_scope :user do
    authenticated :user do
      root 'events#index', as: :authenticated_root
    end

    unauthenticated do
      root 'devise/sessions#new', as: :unauthenticated_root
    end
  end

  resources :events
  resources :users

  get "get_events", to: "events#get_events"

  post 'login', to: 'devise/sessions#create'
  delete 'logout', to: 'devise/sessions#destroy'

end
