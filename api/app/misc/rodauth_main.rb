class RodauthMain < Rodauth::Rails::Auth
  configure do
    # List of authentication features that are loaded.
    enable :create_account, :verify_account, :verify_account_grace_period,
           :login, :logout, :remember, :json, :reset_password,
           :change_password, :change_password_notify, :change_login,
           :verify_login_change, :close_account

    # See the Rodauth documentation for the list of available config options:
    # http://rodauth.jeremyevans.net/documentation.html

    # ==> General
    # The secret key used for hashing public-facing tokens for various features.
    # Defaults to Rails `secret_key_base`, but you can use your own secret key.
    # hmac_secret "26dd8cfe05d91f49689b58b23b91aa70b21e84999509fcd3e3a4d4907ad58e17beb2c795eed1b9965e15684013738b4f00d1f1ef4cc53ca83ad93930eda82b72"

    # Set JWT secret, which is used to cryptographically protect the token.
    # jwt_secret Rails.application.credentials.jwt_secret

    # Accept only JSON requests.
    only_json? true

    # Handle login and password confirmation fields on the client side.
    require_password_confirmation? false
    require_login_confirmation? false

    # Specify the controller used for view rendering and CSRF verification.
    rails_controller { RodauthController }

    # Set on Rodauth controller with the title of the current page.
    title_instance_variable :@page_title

    # Store account status in an integer column without foreign key constraint.
    account_status_column :status

    # Store password hash in a column instead of a separate table.
    account_password_hash_column :password_hash

    # Set password when creating account instead of when verifying.
    verify_account_set_password? false

    # Redirect back to originally requested location after authentication.
    login_return_to_requested_location? true
    # two_factor_auth_return_to_requested_location? true # if using MFA

    # Autologin the user after they have reset their password.
    # reset_password_autologin? true

    # Delete the account record when the user has closed their account.
    # delete_account_on_close? true

    # Redirect to the app from login and registration pages if already logged in.
    # already_logged_in { redirect login_redirect }

    # ==> Emails
    email_from 'hello@crespire.dev'
    # Use a custom mailer for delivering authentication emails.
    create_reset_password_email do
      RodauthMailer.reset_password(self.class.configuration_name, account_id, reset_password_key_value)
    end
    create_verify_account_email do
      RodauthMailer.verify_account(self.class.configuration_name, account_id, verify_account_key_value)
    end
    create_verify_login_change_email do |_login|
      RodauthMailer.verify_login_change(self.class.configuration_name, account_id, verify_login_change_key_value)
    end
    create_password_changed_email do
      RodauthMailer.password_changed(self.class.configuration_name, account_id)
    end
    # create_email_auth_email do
    #   RodauthMailer.email_auth(self.class.configuration_name, account_id, email_auth_key_value)
    # end
    # create_unlock_account_email do
    #   RodauthMailer.unlock_account(self.class.configuration_name, account_id, unlock_account_key_value)
    # end
    send_email do |email|
      # queue email delivery on the mailer after the transaction commits
      db.after_commit { email.deliver_later }
    end

    # ==> Flash
    # Override default flash messages.
    # create_account_notice_flash "Your account has been created. Please verify your account by visiting the confirmation link sent to your email address."
    # require_login_error_flash "Login is required for accessing this page"
    # login_notice_flash nil

    # ==> Validation
    # Override default validation error messages.
    # no_matching_login_message "user with this email address doesn't exist"
    # already_an_account_with_this_login_message "user with this email address already exists"
    # password_too_short_message { "needs to have at least #{password_minimum_length} characters" }
    # login_does_not_meet_requirements_message { "invalid email#{", #{login_requirement_message}" if login_requirement_message}" }

    # Change minimum number of password characters required when creating an account.
    # password_minimum_length 8

    # ==> Remember Feature
    # Remember all logged in users.
    after_login { remember_login }

    # Or only remember users that have ticked a "Remember Me" checkbox on login.
    after_login { remember_login if param_or_nil("remember") }

    # Extend user's remember period when remembered via a cookie
    extend_remember_deadline? true
    # Or only remember users that have ticked a "Remember Me" checkbox on login.
    after_login { remember_login if param_or_nil("remember") }

    # Extend user's remember period when remembered via a cookie
    extend_remember_deadline? true

    # ==> Hooks
    # Validate custom fields in the create account form.
    before_create_account do
      name = param_or_nil('name')
      min_name_length = 3
      max_name_length = 36

      if name && !name.length.between?(min_name_length, max_name_length)
        throw_error_status(422, 'name', "must be between #{min_name_length} and #{max_name_length} characters, got: #{name.length}")
      end

      account[:name] = name || 'user'
    end

    # Return JSON user object after certain actions with some fields held back
    fields_held_back = %i[password_hash id]
    after_login do
      json_response.merge!(user: account.as_json(except: fields_held_back))
    end

    after_create_account do
      json_response.merge!(user: account.as_json(except: fields_held_back))
    end

    after_verify_account do
      json_response.merge!(user: account.as_json(except: fields_held_back))
    end

    # Perform additional actions after the account is created.
    # after_create_account do
    #   Profile.create!(account_id: account_id, name: param("name"))
    # end

    # Do additional cleanup after the account is closed.
    # after_close_account do
    #   Profile.find_by!(account_id: account_id).destroy
    # end

    # ==> Deadlines
    # Change default deadlines for some actions.
    # verify_account_grace_period 3.days
    # reset_password_deadline_interval Hash[hours: 6]
    # verify_login_change_deadline_interval Hash[days: 2]
  end
end
