ENV['RACK_ENV'] = 'test'

require './app'
require_relative './test_helper'
require 'rack/test'

class AppTest < Minitest::Test
  include Rack::Test::Methods

  def app
    App
  end

  def test_it_says_something
    get '/'
    assert last_response.ok?, 'doesnt seem ok'
    assert_equal 'Hello there...', last_response.body
  end

  def test_it_will_fetch
    post '/fetch', { url: 'http://google.com' }
    assert last_response.ok?
    assert_equal 'http://google.com', last_response.body
  end

end