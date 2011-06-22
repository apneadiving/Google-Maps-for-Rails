Dummy::Application.routes.draw do
  match "users/test_list" => "users#test_list", :as => "test_list"
  match "users/ajax_map" => "users#ajax_map", :as => "ajax_map"
  
  resources :users
  root :to => "users#index"
end
