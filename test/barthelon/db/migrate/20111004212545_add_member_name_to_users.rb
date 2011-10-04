class AddMemberNameToUsers < ActiveRecord::Migration
  def self.up
    add_column :users, :name, :string
  end

  def self.down
    remove_column :users, :name
  end
end
