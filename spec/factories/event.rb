FactoryBot.define do 
    factory :event do
      startAt { DateTime.new(2023, 10, 16) }          
      endAt { DateTime.new(2023, 10, 16) }
      association :user
    end
end