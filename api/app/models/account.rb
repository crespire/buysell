class Account < ApplicationRecord
  include Rodauth::Rails.model
  enum :status, unverified: 1, verified: 2, closed: 3

  validates :name, presence: true
  validates :name, length: { in: 3..36, message: 'must be between 3 and 36 characters' }
  validates :name, format: { with: /\A\w{3,36}\Z|\A\Z/, message: 'only word characters allowed' }

  has_many :posts, dependent: :destroy
end
