ActiveRecord::Schema.define(:version => 0) do

    create_table :gmaps4rails_widgets, :force => true do |t|
      t.string    :title
      t.datetime  :created_at
      t.datetime  :updated_at
    end

    add_index :gmaps4rails_widgets, [:title]

end