require 'bundler'
Bundler::GemHelper.install_tasks

desc "launch jasmine specs"
task :jasmine_travis  do
  puts "Starting to run 'rake jasmine:ci'..."
  begin
    require 'jasmine'
    system("export DISPLAY=:99.0 && bundle exec rake jasmine:ci")
    raise "'rake jasmine:ci' failed!" unless $?.exitstatus == 0
  rescue LoadError
    puts "Jasmine was not found"
  end
end
