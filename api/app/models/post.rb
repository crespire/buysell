class Post < ApplicationRecord
  enum :status, draft: 1, published: 2, closed: 3

  validates :body, presence: true
  validates :body, length: { minimum: 5 }
  validates :title, presence: true
  vakudates :title, length: { minimum: 3 }

  belongs_to :account
  has_many_attached :images
end
