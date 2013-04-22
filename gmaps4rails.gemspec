$:.push File.expand_path("../lib", __FILE__)

# Maintain your gem's version:
require "gmaps4rails/version"

# Describe your gem and declare its dependencies:
Gem::Specification.new do |s|
  s.name        = "gmaps4rails"
  s.version     = Gmaps4rails::VERSION
  s.authors     = [%q{Benjamin Roth}, %q{David Ruyer}]
  s.email       = [%q{apnea.diving.deep@gmail.com}, %q{david.ruyer@gmail.com}]
  s.homepage    = %q{http://github.com/apneadiving/Google-Maps-for-Rails}
  s.summary     = %q{Maps made easy for Rails 3}
  s.description = %q{Enables easy display of items (taken from a Rails 3 model) on a Google Maps (JS API V3), OpenLayers, Mapquest and Bing.}
  s.files       = `git ls-files`.split("\n")
  s.test_files  = `git ls-files -- spec/*`.split("\n")

  s.add_development_dependency "rails", "~> 3.2.1"
  s.add_development_dependency "sqlite3"
  s.add_development_dependency "mongoid", "~> 3" if RUBY_VERSION == "1.9.3"
  s.add_development_dependency 'jquery-rails'
  s.add_development_dependency "rspec-rails"
  s.add_development_dependency 'database_cleaner'
  #s.add_development_dependency "capybara"
  #s.add_development_dependency 'launchy'

  # s.add_development_dependency "jasmine"

  # s.add_development_dependency "guard", "~> 1.0.1"
  s.add_development_dependency 'coffee-script'
  # s.add_development_dependency 'guard-jasmine'
  # s.add_development_dependency "guard-rspec"
  s.add_development_dependency 'sprockets'

  s.add_development_dependency "factory_girl_rails"
  s.add_development_dependency "webmock"

  s.add_development_dependency 'pry'
end
