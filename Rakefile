require 'bundler'
Bundler::GemHelper.install_tasks


begin
  require 'jasmine'
  load 'jasmine/tasks/jasmine.rake'
rescue LoadError
  task :jasmine do
    abort "Jasmine is not available. In order to run jasmine, you must: (sudo) gem install jasmine"
  end
end

desc "launch jasmine specs"
task :jasmine_travis  do
  puts "Starting to run 'rake jasmine:ci'..."
  if defined? Jasmine
    system("export DISPLAY=:99.0 && bundle exec rake jasmine:ci")
    raise "'rake jasmine:ci' failed!" unless $?.exitstatus == 0
  else
    puts "Jasmine was not found"
  end
end

