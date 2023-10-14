class User < ApplicationRecord
  devise :database_authenticatable, :registerable, :recoverable, :rememberable, :validatable

  has_many :events, inverse_of: :user
  
  validates :first_name, presence: true, length: { minimum: 2, maximum: 30 }
  validates :last_name, presence: true, length: { minimum: 2, maximum: 30 }

  before_save :set_email_downcase

  validates :username, presence: true,
                      uniqueness: { case_sensitive: false },
                      length: { minimum: 3, maximum: 20 }

  validates :email, presence: true,
                    uniqueness: { case_sensitive: false },
                    length: { maximum: 105 }

  validates :password, length: { minimum: 6 }, confirmation: true, unless: :skip_password_validation

  validates :password_confirmation, confirmation: true

  attr_accessor :skip_password_validation

  def active_for_authentication?
    super and self.active?
  end

  def set_email_downcase
    self.email = email.downcase
  end
  
end