FactoryGirl.define do
  factory :geo_place do  
        
    trait :paris do
      address "Paris, France"
    end
        
    trait :invalid do
      address "home"
    end
    
    address "Toulon, France"
    
    factory :geo_place_paris,    :traits => [:paris]
  end
end