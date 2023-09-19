class SessionsController < ApplicationController

    def new
    end

    def create
        user = User.find_by(email: params[:session][:email].downcase)
        if user
            print('Login efetuado')
            session[:user_id] = user.id
            flash[:notice] = 'Logged with sucessfully'
        else
            print('Não foi possível')
        end
    
    end

    def destroy
    end
    
end