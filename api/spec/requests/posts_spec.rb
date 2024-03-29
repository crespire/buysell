require 'rails_helper'

RSpec.describe "Posts", type: :request do
  context 'unprotected endpoints' do
    describe "index" do
      before do
        FactoryBot.create(:account, :with_posts)
      end

      it 'returns a list of published posts' do
        get '/posts'
        expect(JSON.parse(response.body).length).to be(3) # Test post from seed, plus 2 new ones
      end
    end

    describe 'single post' do
      before do
        @account = FactoryBot.create(:account, :with_posts)
        @headers = { 'CONTENT-TYPE' => 'application/json', 'ACCEPT' => 'application/json' }
      end

      it 'returns the post requested' do
        id = @account.posts.first.id
        body = @account.posts.first.body

        get "/posts/#{id}", headers: @headers
        post = JSON.parse(response.body)
        expect(post['id']).to eq(id)
        expect(post['body']).to eq(body)
      end
    end
  end

  context 'protected endpoints' do
    describe 'user index' do
      before do
        @user = FactoryBot.create(:account, :with_drafts)
        FactoryBot.create(:account, :with_drafts)
        @headers = { 'CONTENT-TYPE' => 'application/json', 'ACCEPTS' => 'application/json' }
        post '/login', params: JSON.dump({ "login": @user.email, "password": @user.password }), headers: @headers
        expect(response.status).to be(200)
      end

      it "returns a list including a user's draft posts" do
        get '/myposts'
        expect(JSON.parse(response.body).length).to be(2)
      end

      it 'is a protected endpoint' do
        post '/logout', headers: @headers
        get '/myposts'
        expect(response.status).to eq(401)
      end
    end

    describe 'create post' do
      before do
        @user = FactoryBot.create(:account, :with_drafts)
        @headers = { 'CONTENT-TYPE' => 'application/json', 'ACCEPTS' => 'application/json' }
        post '/login', params: JSON.dump({ "login": @user.email, "password": @user.password }), headers: @headers
        expect(response.status).to be(200)
      end

      it 'returns the new post' do
        sample_post = { 'title' => 'hello, this is a test', 'body' => 'test content for a test post' }
        post '/posts', params: JSON.dump(sample_post), headers: @headers

        expect(response.status).to eq(201)
        expect(JSON.parse(response.body)).to include('body' => sample_post['body']).and include('title' => sample_post['title'])
      end

      it 'returns a new post when provided an image' do
        sample_post = { 'post' => { 'title' => 'hello', 'body' => 'test body with test.png', 'images' => [fixture_file_upload('test.png', 'image/png')] } }
        post '/posts', params: sample_post, headers: @headers

        expect(response.status).to eq(201)
        response_json = JSON.parse(response.body)
        expect(response_json.keys).to include('images')
        expect(response_json['images']).to include('test.png')
      end

      it 'returns an error when provided an invalid file type' do
        sample_post = { 'post' => { 'title' => 'hello', 'body' => 'test body with test.pdf', 'images' => [fixture_file_upload('test.pdf', 'application/pdf')] } }
        post '/posts', params: sample_post, headers: @headers

        expect(response.status).to eq(422)
        expect(JSON.parse(response.body)).to include('errors')
      end

      it 'is a protected endpoint' do
        sample_post = { 'title' => 'hello, this is another test', 'body' => 'test content for another test post' }
        post '/logout', headers: @headers
        expect(response.status).to be(200)
        post '/posts', params: JSON.dump(sample_post), headers: @headers
        expect(response.status).to eq(401)
      end
    end

    describe 'edit post' do
      before do
        @user = FactoryBot.create(:account, :with_posts)
        @headers = { 'CONTENT-TYPE' => 'application/json', 'ACCEPTS' => 'application/json' }
        post '/login', params: JSON.dump({ "login": @user.email, "password": @user.password }), headers: @headers
        expect(response.status).to be(200)
      end

      it 'returns the updated post' do
        target_post = @user.posts.first
        update = { 'title' => 'this has been edited', 'body' => 'Some new content!' }
        patch "/posts/#{target_post.id}", params: JSON.dump(update), headers: @headers
        expect(response.status).to eq(200)
        expect(JSON.parse(response.body)).to include('title' => update['title']).and include('body' => update['body'])
      end

      it 'returns an updated post with image' do
        target_post = @user.posts.first
        update = { 'post' => { 'images' => [fixture_file_upload('test.png', 'image/png')] } }
        patch "/posts/#{target_post.id}", params: update, headers: @headers

        expect(response.status).to eq(200)
        response_json = JSON.parse(response.body)
        expect(response_json.keys).to include('images')
        expect(response_json['images']).to include('test.png')
      end

      it 'returns an error when trying to update post with invalid file type' do
        target_post = @user.posts.first
        update = { 'post' => { 'images' => [fixture_file_upload('test.pdf', 'application/pdf')] } }
        patch "/posts/#{target_post.id}", params: update, headers: @headers

        expect(response.status).to eq(422)
        expect(JSON.parse(response.body)).to include('errors')
      end

      it 'is a protected end point' do
        target_post = @user.posts.first
        update = { 'title' => 'this has been edited, again', 'body' => 'Some new content, again!' }
        post '/logout', headers: @headers
        expect(response.status).to be(200)
        patch "/posts/#{target_post.id}", params: JSON.dump(update), headers: @headers
        expect(response.status).to be(401)
      end
    end

    describe 'delete post' do
      before do
        @user = FactoryBot.create(:account, :with_posts)
        @headers = { 'CONTENT-TYPE' => 'application/json', 'ACCEPTS' => 'application/json' }
        post '/login', params: JSON.dump({ "login": @user.email, "password": @user.password }), headers: @headers
        expect(response.status).to be(200)
      end

      it 'returns confirmation of deleted post' do
        target_post = @user.posts.first
        delete "/posts/#{target_post.id}"
        expect(response.status).to eq(200)
        expect(JSON.parse(response.body)).to eq({ 'success' => 'Post was deleted.' })
      end

      it 'is a protected end point' do
        target_post = @user.posts.first
        post '/logout', headers: @headers
        expect(response.status).to be(200)
        delete "/posts/#{target_post.id}"
        expect(response.status).to be(401)
      end
    end
  end
end
