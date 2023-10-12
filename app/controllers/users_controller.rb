class UsersController < ApplicationController

    before_action :set_user, only: [:edit, :update]

    def index
         if current_user.present?
            @users = User.all
            unless @users.kind_of?(Array)
                @users = @users.page(params[:page]).per(10)
            else 
                @users = Kaminari.paginate_array(@users).page(params[:page]).per(10)
            end
        else
            flash[:alert] = @@alert_message
            redirect_to root_path
        end
    end

    def new
        @user = User.new
    end

    def create
        @user = User.new(user_params)
        if @user.save
            session[:user_id] = @user.id
            redirect_to events_path
        else 
            render new_user_path
        end
    end

    def edit
    end

    def update
        if @user.update(user_params)
            redirect_to events_path
        else
            render 'edit'
        end
    end

    def set_user
        if current_user.present?
            @user = User.find(params[:id])
            @admin = user_is_admin
        else
            flash[:alert] = @@alert_message
            redirect_to root_path
        end
    end

    private

    def user_params
        if !@admin && @user.present?
            @user.skip_password_validation = true
            params.require(:user).permit(:first_name, :last_name, :username, :email)
        else
            params.require(:user).permit(:first_name, :last_name, :username, :email, :password, :password_confirmation, :admin, :active)  
        end 
    end

end