class UpdatePostPriceDefault < ActiveRecord::Migration[7.0]
  def change
    change_column_default :posts, :price, from: 0, to: nil
  end
end
