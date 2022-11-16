class RemoveNullConstraintOnAccountNameForReal < ActiveRecord::Migration[7.0]
  def change
    change_column_null :accounts, :name, true
  end
end
