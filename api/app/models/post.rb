class Post < ApplicationRecord
  enum :status, draft: 1, published: 2, closed: 3

  validates :body, presence: true
  validates :body, length: { minimum: 5 }
  validates :title, presence: true
  validates :title, length: { minimum: 3 }

  belongs_to :account
  has_many_attached :images

  def generate_image_urls
    return unless images.count.positive?

    images.each_with_object([]) do |file, array|
      array << Rails.application.routes.url_helpers.rails_blob_url(file, only_path: true)
    end
  end
end
