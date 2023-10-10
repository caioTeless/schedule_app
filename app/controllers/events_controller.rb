class EventsController < ApplicationController

    before_action :require_same_user, only: [:destroy]

    def index
        @user = User.find(session[:user_id])

        if @user.admin?
            @users = User.all
        end 
        
        @admin = user_is_admin

        @current_user_name = @user.first_name
        @current_user_id = @user.id
    end

    def get_events
        @events = Event.all
        json_events_users = @events.map do |event| { event_id: event.id, start: event.start, end: event.end, user_id: event.user_id, first_name: event.user.first_name.upcase, last_name: event.user.last_name.upcase} end
        render json: json_events_users
    end

    def new 
        @event = Event.new
    end

    def create
        @event = Event.new(params.require(:event).permit(:start, :end, :user_id))
        @event.user = current_user
        if @event.save
            flash[:notice] = "Hora registrada com sucesso !"
            get_events()
        else
            flash[:alert] = "Erro ao marcar um horário ! Tente novamente"
        end
    end

    def destroy
        @event = Event.find(params[:id])
        puts @event
        if @event.destroy
            flash[:notice] = "Removido com sucesso"
        else 
            flash[:alert] = "Erro encontrado."
        end
    end

    def require_same_user
        @event = Event.find(params[:id])
        if current_user.id != @event.user_id && !current_user.admin?
            flash[:alert] = "Somente o usuário admin ou o usuário do agendamento podem removê-lo"
            render json: { error: "Unauthorized" }, status: :unprocessable_entity
        end
    end
end