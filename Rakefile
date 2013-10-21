require 'bundler'
Bundler::GemHelper.install_tasks

# import 'lib/tasks/jasmine.rake'

begin
  require 'jasmine'
  load 'jasmine/tasks/jasmine.rake'
rescue LoadError
  task :jasmine do
    abort "Jasmine is not available. In order to run jasmine, you must: (sudo) gem install jasmine"
  end
end
