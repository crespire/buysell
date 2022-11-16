class AddNameToAccount < ActiveRecord::Migration[7.0]
  def change
    add_column :accounts, :name, :string, null: false, limit: 36
  end
end
