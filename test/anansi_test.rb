require_relative './test_helper'

class AnansiTest < Minitest::Test

  # the class should be instantiated with the url that will be fetched
  def test_it_knows_its_home
    home = 'http://github.com'
    anansi = Anansi.new(home)
    assert_equal URI.parse(home), anansi.url
  end

  def test_only_valid_uris
    assert_raises URI::InvalidURIError do
      Anansi.new('\/')
    end
  end

  def test_only_http_or_https
    assert_raises ArgumentError do
      Anansi.new('file://test')
    end
    assert Anansi.new('http://test'), 'the http scheme was not accepted'
    assert Anansi.new('https://test'), 'the https scheme was not accepted'
  end


end