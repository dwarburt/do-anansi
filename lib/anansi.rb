require_relative './html_getter'
require 'nokogiri'
class Anansi

  attr_reader :url

  def initialize(page_url)
    @url = URI.parse(page_url)
    @getter = HtmlGetter.new(page_url)
    raise ArgumentError unless [URI::HTTP, URI::HTTPS].include? @url.class
  end

  def inject_getter(new_getter)
    @getter = new_getter
  end

  def page_data
    doc = Nokogiri::HTML(@getter.html)
    links = doc.css('a')
      .select {|a| a.attributes['href']       }
      .map    {|a| a.attributes['href'].value }
      .select {|a| link_local a }
      .map    {|a| asset_path a }

    stylesheets = doc.css('link')
      .select {|a| a.attributes['href'] && a.attributes['rel'] && a.attributes['rel'] == 'stylesheet'}
      .map    {|a| asset_path a.attributes['href'].value}


    imgs = doc.css('img')
      .select {|i| i.attributes['src']}
      .map    {|i| asset_path i.attributes['src'].value}

    scripts = doc.css( 'script')
      .select{|s| s.attributes['src']}
      .map   {|s| asset_path s.attributes['src'].value}

    {
        scripts: scripts,
        imgs: imgs,
        links: links,
        stylesheets: stylesheets,
        url: @url.to_s,
        bytes: @getter.html.size
    }
  end

  private
  #this should return true if the link is for the same domain
  def link_local(link)
    begin
      u = URI.parse link
      host_match = u.host == @url.host
      nil_host = u.host.nil?
      return host_match || nil_host
    rescue
      false
    end
  end

  def asset_path(link)
    URI.join(@url, link).to_s
  end
end
