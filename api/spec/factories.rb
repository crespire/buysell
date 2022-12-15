FactoryBot.define do
  factory :account do
    email { Faker::Internet.email }
    name { Faker::Name.name }
    password { Faker::Internet.password }
  end

  factory :post do
    association :account
    title { Faker::Lorem.sentence }
    body { Faker::Lorem.paragraph }
    status { Faker::Number.within(range: 1..3) }
  end
end