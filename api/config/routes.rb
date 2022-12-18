Rails.application.routes.draw do
  resources :posts

  get '/myposts', to: 'posts#user_index'
  patch '/account', to: 'accounts#update'

  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Defines the root path route ("/")
  # root "articles#index"
end
