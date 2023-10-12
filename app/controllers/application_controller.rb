class ApplicationController < ActionController::Base
    helper_method :current_user, :logged_in?

    @@alert_message = "É necessário estar logado para acessar a agenda !"

    def current_user
        @current_user ||= User.find(session[:user_id]) if session[:user_id] 
    end

    def user_is_admin
        @current_user ||= User.find(session[:user_id]) if session[:user_id] 
        return @current_user.admin
    end

    def logged_in?
        !!current_user 
    end

    def require_user
        if !logged_in?
            flash[:alert] = @@alert_message
            redirect_to login_path
        end
    end
end
