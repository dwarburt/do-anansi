require 'sinatra'
require './lib/anansi'
class App < Sinatra::Base
  get '/' do
    'Hello there...'
  end
  post '/fetch' do
    anansi = Anansi.new params[:url]
    anansi.page_data.to_json
  end
end