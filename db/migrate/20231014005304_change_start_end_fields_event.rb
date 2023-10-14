class ChangeStartEndFieldsEvent < ActiveRecord::Migration[7.0]
  def change
    rename_column :events, :start, :startAt
    rename_column :events, :end, :endAt
  end
end
