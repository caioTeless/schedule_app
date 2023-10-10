class ApplicationController < ActionController::Base
    helper_method :current_user

    def current_user
        @current_user ||= User.find(session[:user_id]) if session[:user_id] 
    end

    def user_is_admin
        @current_user ||= User.find(session[:user_id]) if session[:user_id] 
        return @current_user.admin
    end
end
