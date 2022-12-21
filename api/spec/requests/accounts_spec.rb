require 'rails_helper'

RSpec.describe "Accounts", type: :request do
  describe "Account username update" do
    before do
      @user = FactoryBot.create(:account, password: 'pass1234', name: 'user1')
      @headers = { 'CONTENT-TYPE' => 'application/json', 'ACCEPTS' => 'application/json' }
      post '/login', params: JSON.dump({ "login": @user.email, "password": @user.password }), headers: @headers
      expect(response.status).to be(200)
    end

    it 'returns the updated user with name' do
      new_name = 'new_name'
      update = { 'account': { 'password' => @user.password, 'name' => new_name } }
      patch '/account', params: JSON.dump(update), headers: @headers
      expect(response.status).to eq(200)
      expect(JSON.parse(response.body)).to include('name' => new_name)
    end

    it 'returns an error with the incorrect password' do
      new_name = 'new_name'
      update = { 'account': { 'password' => 'wrong1password', 'name' => new_name } }
      patch '/account', params: JSON.dump(update), headers: @headers
      expect(response.status).to eq(401)
      expect(JSON.parse(response.body)).to eq({ 'error' => 'problem with password' })
    end

    it 'returns an error with an invalid new name' do
      new_name = 'ne'
      update = { 'account': { 'password' => @user.password, 'name' => new_name } }
      patch '/account', params: JSON.dump(update), headers: @headers
      expect(response.status).to eq(422)
      expect(JSON.parse(response.body)).to include('name' => ['must be between 3 and 36 characters', 'only word characters allowed'])
    end

    it 'is a protected end point' do
      update = { 'account': {  'password' => @user.password, 'body' => 'user_name2' } }
      post '/logout', headers: @headers
      expect(response.status).to be(200)
      patch '/account', params: JSON.dump(update), headers: @headers
      expect(response.status).to be(401)
    end
  end
end
