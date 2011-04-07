Dummy::Application.routes.draw do
  match "users/test_list" => "users#test_list", :as => "test_list"
  resources :users
  root :to => "users#index"
end
