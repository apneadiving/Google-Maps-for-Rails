Dummy::Application.routes.draw do
  match "users/test_list" => "users#test_list", :as => "test_list"
  match "users/test_partial" => "users#test_partial", :as => "test_partial"
  match "users/ajax_map" => "users#ajax_map", :as => "ajax_map"
  match "users/renderer" => "users#renderer", :as => "renderer"
  resources :users
  root :to => "users#index"
end
