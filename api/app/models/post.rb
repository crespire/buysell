class Post < ApplicationRecord
  enum :status, draft: 1, published: 2, closed: 3

  validates :body, presence: true
  validates :body, length: { minimum: 5 }
  validates :title, presence: true
  validates :title, length: { minimum: 3 }
  validate :image_types

  belongs_to :account
  has_many_attached :images

  def image_types
    return unless images.attached?

    allowed_types = %w[image/jpeg image/gif image/png image/webp image/apng]
    images.each do |image|
      unless image.content_type.in?(allowed_types)
        errors.add(:errors, "#{image.name}'s type '#{image.content_type}' is disallowed, accepted formats: #{allowed_types.join(', ')}")
        image.purge_later
      end
    end
  end

  def image_urls
    return {} unless images.attached?

    images.each_with_object({}) do |file, hash|
      path = Rails.application.routes.url_helpers.rails_blob_url(file, only_path: true)
      # path = file.url
      filename = path.split('/').last
      hash[filename] = path
    end
  end
end
