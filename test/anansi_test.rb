require_relative './test_helper'

class AnansiTest < Minitest::Test

  EX = 'http://example.com'
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

  def test_html_is_parsed
    a = Anansi.new('http://www.reddit.com/r/TuxedoCats/')
    a.inject_getter MockHtmlGetter.new
    assert a.page_data
  end

  def test_one_link_is_local
    a = Anansi.new(EX)
    a.inject_getter MockHtmlGetter.new(:one_local_link)
    assert_equal 1, a.page_data[:links].count
  end

  def test_two_links
    a = Anansi.new(EX)
    a.inject_getter MockHtmlGetter.new(:two_links)
    assert_equal 2, a.page_data[:links].count
  end

  def test_asset_path
    a = Anansi.new(EX)
    mhg = MockHtmlGetter.new
    mhg.html = '
      <htm>
        <img src="/rooted_asset.css">
        <img src="unrooted_asset.css">
        <img src="http://another_domain.com/rooted/longer/path/to/file.css">
    '
    a.inject_getter mhg
    pg = a.page_data
    assert_equal EX + '/rooted_asset.css', pg[:imgs][0]
    assert_equal EX + '/unrooted_asset.css', pg[:imgs][1]
    assert_equal 'http://another_domain.com/rooted/longer/path/to/file.css', pg[:imgs][2]
  end




end