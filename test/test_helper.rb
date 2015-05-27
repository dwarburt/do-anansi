require 'minitest/reporters'
require 'minitest/autorun'
#require 'minitest/pride'
require 'uri'
require 'anansi'
require 'html_getter'

MiniTest::Reporters.use!

class MockHtmlGetter

  def initialize(mode = :reddit)
    @mode = mode
  end

  def html
    case @mode
      when :reddit
        File.read(File.dirname(__FILE__) + '/test_html.html')
      when :two_links
        '<a href="x" /> <a href="x2" />'
      when :one_local_link
        '<a href="http://example.com/x" /> <a href="http://example.org/y" />'
      else
        ''
    end
  end
end