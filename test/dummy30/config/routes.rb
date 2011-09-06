Dummy::Application.routes.draw do

  resources :users do
    collection do 
      get "test_list", :as => "test_list"
      get "test_partial", :as => "test_partial"
      get "ajax_map", :as => "ajax_map"
      get "renderer", :as => "renderer"      
    end
  end
  
  root :to => "users#index"
end
