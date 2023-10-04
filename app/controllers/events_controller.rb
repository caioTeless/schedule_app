class EventsController < ApplicationController
    def index
        @current_user_username = session[:username]
        @current_user_id = session[:user_id]
    end

    def get_events
        @events = Event.all
        json_events_users = @events.map do |event| { event_id: event.id, start: event.start, end: event.end, user_id: event.user_id, username: event.user.username.upcase } end
        render json: json_events_users
    end

    def new 
        @event = Event.new
    end

    def create
        @event = Event.new(params.require(:event).permit(:start, :end, :user_id))
        if @event.save
            flash[:notice] = "Hora marcada com sucesso !"
        else
            flash[:alert] = "Erro ao marcar um horário ! Tente novamente"
            render events_path
        end
    end

    def destroy
        #@event = Event.find(params[:event_id])
        @event.destroy 
        redirect_to events_path
    end
end