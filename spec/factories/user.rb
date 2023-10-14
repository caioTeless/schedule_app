FactoryBot.define do 
    factory :user do
      email { 'user@teste123.com' } 
      first_name {'user123'}
      last_name {'Teste'}
      username {'usertest123'}
      password {'123456'}
      initialize_with { User.find_or_initialize_by(email: email)}
    end
end