class User < ApplicationRecord

    #has_many :events

    validates :first_name, presence: true, length: {minimum: 2, maximum: 30}
    validates :last_name, presence: true, length: {minimum: 2, maximum: 30}

    before_save { self.email = email.downcase }    
    validates :username, presence: true,
    uniqueness: {case_sensitive: false},
    length: {minimum: 3, maximum: 20}

    EMAIL_VALIDATOR_REGEX = /\A[\w+\-.]+@[a-z\d\-.]+\.[a-z]+\z/i
    
    validates :email, presence: true,
    uniqueness: {case_sensitive: false},
    length: {maximum: 105},  
    format: {with: EMAIL_VALIDATOR_REGEX}

    has_secure_password
    # validates :password, length: { minimum: 8 }, confirmation: true
    # attr_accessor :password_confirmation
    # validates :password_confirmation, confirmation: { message: "A confirmação de senha não coincide com a senha" }
    
end