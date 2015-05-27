require 'html_getter'

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

end
