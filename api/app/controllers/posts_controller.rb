class PostsController < ApplicationController
  before_action :set_post, only: %i[show]
  before_action :scoped_set_post, only: %i[update destroy]
  before_action :authenticate, only: %i[create update destroy]

  # GET /posts
  def index
    @posts = Post.includes(:account, :images_blobs).all

    render json: @posts, include: [{ account: { only: [:name] } }, :images_blobs]
  end

  # GET /posts/1
  def show
    render json: @post, include: [{ account: { only: [:name] } }, :images_blobs]
  end

  # POST /posts
  def create
    puts params
    @post = current_account.posts.build(post_params)

    if @post.save
      render json: @post, status: :created, location: @post
    else
      render json: @post.errors, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /posts/1
  def update
    if @post.update(post_params)
      render json: @post
    else
      render json: @post.errors, status: :unprocessable_entity
    end
  end

  # DELETE /posts/1
  def destroy
    @post.destroy
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_post
      @post = Post.includes(:account, :images_blobs).find(params[:id])
    end

    def scoped_set_post
      @post = current_account.posts.find(params[:id])
    end

    # Only allow a list of trusted parameters through.
    def post_params
      params.require(:post).permit(:title, :body, :status, images: [])
    end
end
