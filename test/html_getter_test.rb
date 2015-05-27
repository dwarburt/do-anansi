require_relative './test_helper'
require 'json'

class HtmlGetterTest < Minitest::Test
  def dont_test_it_gets_the_echo
    h = HtmlGetter.new('http://scooterlabs.com/echo.json')
    assert h.html
  end
  def dont_test_it_got_json
    h = HtmlGetter.new('http://scooterlabs.com/echo.json')
    o = JSON.parse( h.html )
    assert_equal 'GET', o['method']
    assert_equal 'scooterlabs.com', o['headers']['Host']
  end
  def test_mock_works
    m = MockHtmlGetter.new
    assert_match 'html',  m.html
  end
end