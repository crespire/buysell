class AddAdminToAccount < ActiveRecord::Migration[7.0]
  def change
    add_column :accounts, :admin, :boolean, default: false, null: false
  end
end
