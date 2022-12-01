class Post < ApplicationRecord
  enum :status, draft: 1, published: 2, closed: 3

  validates :body, presence: true
  validates :body, length: { minimum: 5 }
  validates :title, presence: true
  validates :title, length: { minimum: 3 }

  belongs_to :account
  has_many_attached :images

  def image_urls
    return {} unless images.size.positive?

    images.each_with_object({}) do |file, hash|
      path = Rails.application.routes.url_helpers.rails_blob_url(file, only_path: true)
      filename = path.split('/').last
      hash[filename] = path
    end
  end
end
