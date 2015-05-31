FROM ruby:2.2
MAINTAINER david.warburton@gmail.com
LABEL version=0.1
RUN mkdir /app
WORKDIR /app
COPY Gemfile /app/
COPY Gemfile.lock /app/
RUN bundle install
EXPOSE 9292
COPY . /app/
CMD rackup -o 0.0.0.0
