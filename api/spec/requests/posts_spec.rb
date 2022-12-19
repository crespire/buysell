require 'rails_helper'

RSpec.describe "Posts", type: :request do
  describe "Index Action" do
    before do
      FactoryBot.create(:account, :with_posts)
      headers = {
        'ACCEPT' => 'application/json',
        'CONTENT-TYPE' => 'application/json'
      }
    end

    it 'returns a list of published posts' do
      get '/posts'
      expect(JSON.parse(response.body).length).to eq(2)
    end
  end
end
