FactoryBot.define do
  factory :account do
    email { Faker::Internet.email }
    name { Faker::Name.first_name }
    password { Faker::Internet.password }
    status { 'verified' }

    trait :admin do
      admin { true }
    end

    trait :with_drafts do
      transient do
        amount { 2 }
      end

      after(:create) do |account, evaluator|
        evaluator.amount.times { create :post, :draft, account: account }
      end
    end

    trait :with_posts do
      transient do
        amount { 2 }
      end

      after(:create) do |account, evaluator|
        evaluator.amount.times { create :post, :published, account: account }
      end
    end
  end

  factory :post do
    association :account
    title { Faker::Lorem.sentence }
    body { Faker::Lorem.paragraph }
    # Factorybot autodefines traits for status
  end
end
