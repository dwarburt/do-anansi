require 'sinatra'
require 'json'
require 'slim'
require './lib/anansi'

class App < Sinatra::Base
  get '/' do
    slim :index
  end
  post '/fetch' do
    anansi = Anansi.new params[:url]
    anansi.page_data.to_json
  end
end
