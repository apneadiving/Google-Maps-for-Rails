class CreateUsers < ActiveRecord::Migration
  def self.up
    create_table :users do |t|
      t.string    :name
      t.string    :address
      t.text      :description
      t.string    :picture
      t.float     :lat_test
      t.float     :long_test
      t.float     :latitude
      t.float     :longitude
      t.boolean   :gmaps
      t.boolean   :bool_test
      t.timestamps
    end
  end

  def self.down
    drop_table :users
  end
end
