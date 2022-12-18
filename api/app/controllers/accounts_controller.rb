class AccountsController < ApplicationController
  before_action :authenticate, only: %i[update]

  # PATCH /account/1
  def update
    if current_account.update(account_params.reject { |k| k['password'] })
      render json: current_account.to_json(except: :password_hash)
    else
      render json: current_account.errors, status: :unprocessable_entity
    end
  end

  private
  # Only allow a list of trusted parameters through.
  def account_params
    params.require(:account).permit(:name)
  end
end
