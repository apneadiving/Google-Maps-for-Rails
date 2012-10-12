require 'singleton'

module Gmaps4rails
  def self.config
    Config.instance
  end

  class Config
    include Singleton

    def options
      yaml_loader.load
    end

    protected

    def yaml_loader
      @yaml_loader ||= YamlLoader.new
    end

    class YamlLoader
      attr_writer :config_file, :config_path

      def load
        @load ||= HashWithIndifferentAccess.new load_yaml    
      end

      def config_path
        Rails.root.join 'config', config_file
      end

      def config_file
        @config_file ||= 'gmaps4rails.yml'
      end

      protected

      def load_yaml      
        @yaml ||= begin
          YAML.load File.read(config_path)
        rescue
          {}
        end        
      end
    end
  end
end