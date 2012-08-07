FactoryGirl.define do
  factory :place do  
        
    trait :paris do
      address "Paris, France"
    end
        
    trait :invalid do
      address "home"
    end
    
    address "Toulon, France"
    
    factory :place_paris,    :traits => [:paris]
  end
end