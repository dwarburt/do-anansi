require 'sinatra'

class App < Sinatra::Base
  get '/' do
    'Hello there...'
  end
  post '/fetch' do
    params[:url]
  end
end