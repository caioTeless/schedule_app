class ApplicationController < ActionController::Base

    before_action :configure_permitted_parameters, if: :devise_controller?

    protected
  
    def configure_permitted_parameters
      devise_parameter_sanitizer.permit(:sign_up, keys: [:email, :password, :password_confirmation, :first_name, :last_name, :username])
      devise_parameter_sanitizer.permit(:account_update, keys: [:email, :password, :password_confirmation, :current_password, :first_name, :last_name, :username, :admin, :active])
    end

    def resource_name
      :user
    end
      
    def resource
      @resource ||= User.new
    end
      
    def devise_mapping
      @devise_mapping ||= Devise.mappings[:user]
    end

end
