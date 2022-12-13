class PostsController < ApplicationController
  before_action :set_post, only: %i[show]
  before_action :scoped_set_post, only: %i[update destroy]
  before_action :authenticate, only: %i[create update destroy]

  # GET /posts
  def index
    @posts = Post.includes(:account).all.with_attached_images
    @posts = @posts.map do |post|
      include_resources(post)
    end
    render json: @posts
  end

  # GET /posts/1
  def show
    render json: include_resources(@post)
  end

  # POST /posts
  def create
    @post = current_account.posts.build(post_params)

    if @post.save
      render json: @post, status: :created, location: @post
    else
      render json: @post.errors, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /posts/1
  def update
    puts params[:filesToPurge]
    if @post.update(post_params)
      render json: include_resources(@post)
    else
      render json: @post.errors, status: :unprocessable_entity
    end
  end

  # DELETE /posts/1
  def destroy
    if @post.destroy
      render json: { 'success': 'Post was deleted.' }, status: :ok
    else
      render json: { 'error': 'Post not deleted.' }, status: :internal_server_error
    end
  end

  private

  # Use callbacks to share common setup or constraints between actions.
  def set_post
    @post = Post.includes(:account).with_attached_images.find(params[:id])
  end

  # Scoped post set
  def scoped_set_post
    @post = current_account.admin? ? set_post : current_account.posts.find(params[:id])
  end

  def include_resources(post)
    post.as_json.merge({ account: {
                           name: post.account.name,
                           id: post.account.id
                         },
                         images: post.image_urls })
  end

  # Only allow a list of trusted parameters through.
  def post_params
    params.require(:post).permit(:title, :body, :status, :to_purge, images: [])
  end
end
