class Users::RegistrationsController < Devise::RegistrationsController

    before_action :authenticate_user!
    def edit
    end
    
    def update
        if resource.update_without_password(account_update_params)
            redirect_to events_path
        else
            redirect_to edit_user_registration_path
        end
    end
    
      private

    def account_update_params
        params.require(:user).permit(:email, :password, :password_confirmation)
    end
  end
  