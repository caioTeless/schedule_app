class UsersController < ApplicationController

    before_action :set_user, only: [:edit, :update]
    before_action :authenticate_user!

    def index
        @users = User.all
        if current_user != nil && current_user.active
            unless @users.kind_of?(Array)
                @users = @users.page(params[:page]).per(10)
            else 
                @users = Kaminari.paginate_array(@users).page(params[:page]).per(10)
            end
        else
            flash[:alert] = "Usuário inativo ou inexistente, contate o administrador !"
            redirect_to new_user_session_path
        end
    end

    def new
        @user = User.new
    end

    def create
        @user = User.new(user_params)
        if @user.save
            redirect_to events_path
        else 
            render new_user_session_path
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
        @user = User.find(params[:id])
        @admin = current_user.id
    end

    private

    def user_params
        @user.skip_password_validation = true
        params.require(:user).permit(:first_name, :last_name, :username, :email, :password, :password_confirmation, :admin, :active)  
    end


end