require 'minitest/reporters'
require 'minitest/autorun'
#require 'minitest/pride'
require 'uri'
require 'anansi'
require 'html_getter'

MiniTest::Reporters.use!

class MockHtmlGetter
  def html
    File.read(File.dirname(__FILE__) + '/test_html.html')
  end
end