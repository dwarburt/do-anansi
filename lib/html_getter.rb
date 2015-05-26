require 'patron'
class HtmlGetter
  def initialize(url)
    @url = URI.parse(url)
  end
  def html
    session = Patron::Session.new
    session.timeout = 25
    session.base_url = "#{@url.scheme}://#{@url.host}/"
    session.headers['User-Agent'] = 'DoAnAnsi/1.0 http://github.com/dwarburt/do-anansi'
    response = session.get(@url.path)
    if response.status < 400
      return response.body
    end
    nil
  end
end