class UsersController < ApplicationController

    before_action :set_user, only: [:edit, :update]

    def index
        @users = User.all
    end

    def new
        @user = User.new
    end

    def create
        @user = User.new(params.require(:user).permit(:first_name, :last_name, :username, :email, :password, :password_confirmation))
        if @user.save
            flash[:notice] = "Usuário criado com sucesso !"
            session[:user_id] = @user.id
            redirect_to events_path
        else 
            flash[:alert] = "Ocorreu uma inconsistência, verifique os campos !"
            render new_user_path
        end
    end

    def edit
    end

    def update
        if @user.update(params.require(:user).permit(:first_name, :last_name, :username, :email, :password, :password_confirmation, :admin, :active))
            flash[:notice] = "The user has been updated"
            redirect_to events_path
        else
            render 'edit'
        end
    end

    def set_user
        @user = User.find(params[:id])
        @admin = user_is_admin
        puts @admin
    end

end