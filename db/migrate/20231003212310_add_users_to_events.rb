class AddUsersToEvents < ActiveRecord::Migration[7.0]
  def change
    add_column :events, :user_id, :int
  end
end
