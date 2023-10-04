class SessionsController < ApplicationController

    def new
    end

    def create
        @user = User.find_by(email: params[:session][:email].downcase)
        if @user && @user.authenticate(params[:session][:password])
            session[:user_id] = @user.id
            session[:email] = @user.email
            session[:username] = @user.username
            flash[:notice] = 'Login realizado !'
            redirect_to events_path
        else 
            flash[:alert] = "Verifique o usuário e senha !"
            redirect_to root_path
        end
    end

    def destroy
        flash[:notice] = "Logoff realizado !"
        session[:user_id] = nil
        redirect_to root_path
    end
    
end