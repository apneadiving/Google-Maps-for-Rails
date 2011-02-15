namespace :gmaps4rails do
  desc "Copies all migrations and assets (NOTE: This will be obsolete with Rails 3.1)"
  task :install do
    source = File.join(File.dirname(__FILE__), '..', '..', 'public')
    destination = File.join(Rails.root, 'public')
    puts "INFO: Mirroring assets from #{source} to #{destination}"
    Spree::FileUtilz.mirror_files(source, destination)
  end
end