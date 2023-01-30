class Post < ApplicationRecord
  attr_accessor :images_to_purge # virtual field to accomodate update

  enum :status, draft: 1, published: 2, closed: 3

  belongs_to :account
  has_many_attached :images

  validates :body, presence: true
  validates :body, length: { minimum: 5 }
  validates :title, presence: true
  validates :title, length: { minimum: 3 }
  validate :image_types

  def image_types
    allowed_types = %w[image/jpeg image/gif image/png image/webp image/apng]
    images.each do |file|
      unless file.content_type.in?(allowed_types)
        errors.add(:errors, "#{file.filename}'s type '#{file.content_type}' is disallowed, accepted formats: #{allowed_types.join(', ')}")
        file.purge_later if file.id
      end
    end
  end

  def image_urls
    return {} unless images.attached?

    images.each_with_object({}) do |file, hash|
      path = Rails.application.routes.url_helpers.rails_blob_url(file, only_path: true)
      filename = path.split('/').last
      hash[filename] = path
    end
  end
end
