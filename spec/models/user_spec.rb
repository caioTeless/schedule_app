require 'rails_helper'

RSpec.describe User, type: :model do

    subject(:user) { create(:user) }

    describe '#have_many' do
        it { is_expected.to have_many(:events) }
    end

    describe '#validate_presence_of' do 
        it { is_expected.to validate_presence_of(:first_name) }
        it { is_expected.to validate_presence_of(:last_name) }
        it { is_expected.to validate_presence_of(:username) }
        it { is_expected.to validate_presence_of(:email) }
    end

    describe '#active_for_authentication?' do
        it 'validates if user is active' do
          expect(user.active_for_authentication?).to be_truthy           
        end
    end

    describe '#validate_length_of' do
      it { is_expected.to validate_length_of(:first_name)}
      it { is_expected.to validate_length_of(:last_name)}
      it { is_expected.to validate_length_of(:username)}
      it { is_expected.to validate_length_of(:email)}
      it { is_expected.to validate_length_of(:password)}
    end

    describe '#validate_uniqueness' do
      it { is_expected.to validate_uniqueness_of(:username).case_insensitive  }
      it { is_expected.to validate_uniqueness_of(:email).case_insensitive }
    end

    describe '#validate_confirmation' do
      it { is_expected.to validate_confirmation_of(:password)}
      it { is_expected.to validate_confirmation_of(:password_confirmation)}
    end

    describe '#set_email_downcase' do 
      before do 
        user.update_columns(email: 'Teste@Gmail.Com')
      end
      it 'validates email downcase' do
        expect{user.set_email_downcase}.to change { user.email }.from('Teste@Gmail.Com').to('teste@gmail.com')
      end
    end

end