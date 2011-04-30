class RemoveAddressFromUsers < ActiveRecord::Migration
  def self.up
    remove_column :users, :address
  end

  def self.down
    add_column :users, :address, :string
  end
end
