class Anansi

  attr_reader :url
  def initialize(page_url)
    @url = URI.parse(page_url)
    raise ArgumentError unless [URI::HTTP, URI::HTTPS].include? @url.class
  end
end
