class UsersController < ApplicationController

    def new
        @user = User.new
    end

    def create
        @user = User.new(params.require(:user).permit(:username, :email, :password, :password_confirmation))
        if @user.save
            flash[:notice] = "Usuário criado com sucesso !"
            session[:user_id] = @user.id
            redirect_to events_path
        else 
            flash[:alert] = "Ocorreu uma inconsistência, verifique os campos !"
            render new_user_path
        end
    end

end