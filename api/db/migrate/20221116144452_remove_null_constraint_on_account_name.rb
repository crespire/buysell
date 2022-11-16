class RemoveNullConstraintOnAccountName < ActiveRecord::Migration[7.0]
  def change
    change_column_null :accounts, :name, false
    change_column_default :accounts, :name, 'user'
  end
end
