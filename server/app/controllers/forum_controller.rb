class ForumController < ApplicationController
    include Firewall

    def get_posts
        if is :private
            return
        end
        limit = params[:limit] || -1
        offset = params[:offset] || 0
        posts = Post.order(created_at: :desc).limit(limit).offset(offset).includes(:user).load
        response = Array.new
        posts.each do |post|
            response << { id: post.id, content: post.content, created_at: post.created_at, author: post.author, author_name: post.user.name }
        end
        total = Post.count
        pagination = { has_more: (total > limit.to_i + offset.to_i - 1 ), last: [total, offset.to_i + limit.to_i].min }
        render json: { pagination: pagination, posts: response }
    end

    def new_post
        if is :private
            return
        end
        new_post = Post.new
        new_post.author = @firewall_user.id
        new_post.content = params[:content]
        new_post.save
        render json: { id: new_post.id, content: new_post.content, created_at: new_post.created_at, author: new_post.author, author_name: new_post.user.name }
    end

    def options
        # Already handled at the app controller
        head :ok
    end
end
