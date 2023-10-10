Rails.application.routes.draw do
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Defines the root path route ("/")
  # root "articles#index"
  root "sessions#new"
  resources :events, only: [:index, :new, :create, :destroy, :delete]

  resources :users, only: [:index, :new, :create, :edit, :update]

  get "get_events", to: "events#get_events"

  post 'login', to: 'sessions#create'
  delete 'logout', to: 'sessions#destroy'

end
