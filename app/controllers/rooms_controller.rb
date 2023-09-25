class RoomsController < ApplicationController
    def index
        @email = session[:email]
    end
end