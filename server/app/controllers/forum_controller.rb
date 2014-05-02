class ForumController < ApplicationController
    include Firewall

    def get_posts
        if is :private
            return
        end
        posts = Post.all
        render json: posts
    end

    def new_post
        if is :private
            return
        end
        new_post = Post.new
        new_post.author = @firewall_user.id
        new_post.content = params[:content]
        new_post.save
        render json: new_post
    end

    def options
        # Already handled at the app controller
        head :ok
    end
end
