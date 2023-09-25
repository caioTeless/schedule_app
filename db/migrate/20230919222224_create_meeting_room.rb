class CreateMeetingRoom < ActiveRecord::Migration[7.0]
  def change
    create_table :meeting_rooms do |t|
      t.date  :date
      t.integer :weekday
      t.time  :schedule_time
      t.timestamps
    end
  end
end
