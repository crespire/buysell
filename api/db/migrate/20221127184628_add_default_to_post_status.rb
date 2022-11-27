class AddDefaultToPostStatus < ActiveRecord::Migration[7.0]
  def change
    change_column_default :posts, :status, 1
  end
end
