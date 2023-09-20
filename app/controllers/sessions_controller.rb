class SessionsController < ApplicationController

    def new
    end

    def create
        @user = User.find_by(email: params[:session][:email].downcase)
        if @user
            session[:user_id] = @user.id
            session[:email] = @user.email
            flash[:notice] = 'Logged with sucessfully'
            redirect_to rooms_path
        end
    end

    def destroy
        print('destroyed')
        session[:user_id] = nil
        redirect_to root_path
    end
    
end