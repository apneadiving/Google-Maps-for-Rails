Factory.define :user do |f|  
  f.name    "me"
  f.address "Toulon, France"
end

Factory.define :user_paris, :parent => :user do |f|
  f.name    "me"
  f.address "Paris, France"
end

Factory.define :user_with_pic, :parent => :user do |f|
  f.name    "me"
  f.address "Toulon, France"
  f.picture "http://www.blankdots.com/img/github-32x32.png"
end

Factory.define :invalid_user, :parent => :user do |f|
  f.name    "me"
  f.address "home"
end
