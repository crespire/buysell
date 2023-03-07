class AddPriceAndLocationToPost < ActiveRecord::Migration[7.0]
  def change
    add_column :posts, :price, :decimal, precision: 6, scale: 2, default: 0
    add_column :posts, :location, :string, default: nil, limit: 100
  end
end
