class Post < ActiveRecord::Base
        belongs_to :user, :foreign_key => :author, :primary_key => :id
end
