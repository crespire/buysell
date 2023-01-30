class PostsController < ApplicationController
  before_action :set_post, only: %i[show]
  before_action :scoped_set_post, only: %i[update destroy]
  before_action :authenticate, only: %i[user_index create update destroy]

  # GET /posts
  def index
    @posts = Post.includes(:account).where(status: 'published').with_attached_images
    @posts = @posts.map do |post|
      include_resources(post)
    end
    render json: @posts
  end

  # GET /myposts
  def user_index
    @posts = current_account.posts.all.includes(:account).with_attached_images
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
      render json: include_resources(@post), status: :created, location: @post
    else
      render json: @post.errors, status: :unprocessable_entity
    end
  end

  # PATCH /posts/1
  def update
    if @post.update(post_params)

      # Purge images if requested
      if post_params[:images_to_purge].present?
        post_params[:images_to_purge].each do |target|
          @post.images.each do |image|
            image.purge if image.filename == target
          end
        end
      end

      # Add new files if requested
      if post_params[:images].present?
        post_params[:images].each do |file|
          @post.images.attach(file)
        end
      end

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

  # Scoped post set: admin can set any, or use current account posts
  def scoped_set_post
    render json: { 'error': 'Please login to continue' }, status: :unauthorized and return if current_account.nil?

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
    params.require(:post).permit(:title, :body, :status, images_to_purge: [], images: [])
  end
end
