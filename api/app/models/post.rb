class Post < ApplicationRecord
  enum :status, draft: 1, published: 2, closed: 3

  belongs_to :account
  has_many_attached :images
end
