class CreateGmaps4railsTables < ActiveRecord::Migration
  def self.up
    SCHEMA_AUTO_INSERTED_HERE
  end

  def self.down
    drop_table :gmaps4rails_widgets
  end
end
