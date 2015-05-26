require 'sinatra'
class App < Sinatra::Base
  get '/' do
    'Hello there...'
  end
end