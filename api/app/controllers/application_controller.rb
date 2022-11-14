class ApplicationController < ActionController::API

  private
  
  def current_account
    rodauth.rails_account
  end

  def authenticate
    rodauth.require_account
  end

end
