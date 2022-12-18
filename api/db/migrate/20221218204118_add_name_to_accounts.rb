class AddNameToAccounts < ActiveRecord::Migration[7.0]
  def change
    add_column :accounts, :name, :string, default: 'user', limit: 36, null: false
  end
end
