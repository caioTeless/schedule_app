class EventsController < ApplicationController

    before_action :require_same_user, only: [:destroy]
    before_action :authenticate_user!

    def index
           @user = User.find(current_user.id)
            if @user.admin?
                @users = User.all
            end 
            
            @current_user_name = "#{@user.first_name} #{@user.last_name}"
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
        @event = Event.new(event_params)
        @event.user = current_user
        if @event.save
            get_events()
        else
            render 'index'
        end
    end

    def destroy
        @event = Event.find(params[:id])
        @event.destroy
    end

    def require_same_user
        @event = Event.find(params[:id])
        if current_user.id != @event.user_id && !current_user.admin?
            render json: { error: "Unauthorized" }, status: :unprocessable_entity
        end
    end

    private

    def event_params
        params.require(:event).permit(:start, :end, :user_id)
    end
    
end