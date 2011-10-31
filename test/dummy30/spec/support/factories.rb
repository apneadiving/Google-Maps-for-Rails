FactoryGirl.define do
  factory :user do  
    name        random_string
    sec_address "Toulon, France"
  end

  factory :user_paris, :parent => :user do
    name    "me"
    sec_address "Paris, France"
  end
  
  factory :user_with_pic, :parent => :user do
    name    "me"
    sec_address "Toulon, France"
    picture "http://www.blankdots.com/img/github-32x32.png"
  end

  factory :invalid_user, :parent => :user do
    name    "me"
    sec_address "home"
  end
end