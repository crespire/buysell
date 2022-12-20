require 'rails_helper'

RSpec.describe "Posts", type: :request do
  context 'unprotected endpooints' do
    describe "index Action" do
      before do
        FactoryBot.create(:account, :with_posts)
        headers = {
          'ACCEPT' => 'application/json',
          'CONTENT-TYPE' => 'application/json'
        }
      end

      it 'returns a list of published posts' do
        get '/posts'
        expect(JSON.parse(response.body).length).to be(3) # Test post from seed, plus 2 new ones
      end
    end
  end

  context 'protected enpoints' do
    describe 'user index action' do
      before(:each) do
        @user = FactoryBot.create(:account, :with_drafts)
        FactoryBot.create(:account, :with_drafts)
      end

      it 'returns a list of draft posts' do
        headers = { "CONTENT_TYPE" => "application/json" }
        post '/login', params: JSON.dump({ "login": @user.email, "password": @user.password }), headers: headers
        expect(response.status).to be(200)
  
        get '/myposts'
        expect(JSON.parse(response.body).length).to be(2)
      end
    end
  end
end
