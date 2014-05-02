require 'test_helper'

class ForumControllerTest < ActionController::TestCase
  test "should get get_posts" do
    get :get_posts
    assert_response :success
  end

end
