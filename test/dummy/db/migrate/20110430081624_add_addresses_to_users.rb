class AddAddressesToUsers < ActiveRecord::Migration
  def self.up
    add_column :users, :norm_address, :string
    add_column :users, :sec_address, :string
  end

  def self.down
    remove_column :users, :sec_address
    remove_column :users, :norm_address
  end
end
