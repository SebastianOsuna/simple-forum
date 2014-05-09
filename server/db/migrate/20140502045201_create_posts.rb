class CreatePosts < ActiveRecord::Migration
  def change
    create_table :posts do |t|
      t.belongs_to :user
      t.string :content
      t.integer :author

      t.timestamps
    end
  end
end
