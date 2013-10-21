require 'bundler'
Bundler::GemHelper.install_tasks

desc "build the db and populate it with sample data"
task :jasmine_travis  do
  puts "Starting to run 'rake jasmine:ci'..."
  if defined? Jasmine
    system("export DISPLAY=:99.0 && bundle exec rake jasmine:ci")
    raise "'rake jasmine:ci' failed!" unless $?.exitstatus == 0
  else
    puts "Jasmine was not found"
  end
end
