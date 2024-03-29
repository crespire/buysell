# Be sure to restart your server when you modify this file.

# Avoid CORS issues when API is called from the frontend app.
# Handle Cross-Origin Resource Sharing (CORS) in order to accept cross-origin AJAX requests.

# Read more: https://github.com/cyu/rack-cors

Rails.application.config.middleware.insert_before 0, Rack::Cors do
  allow do
    # origins 'http://localhost:3001', '127.0.0.1:3001', 'http://localhost:3000', '127.0.0.1:3000'

    origins 'buysell.crespire.dev', 'buysell-backend.crespire.dev'
    resource '*', headers: :any, methods: %i[get post put patch delete options head], credentials: true
  end
end

# Rails.application.config.hosts << 'localhost:3001'
# Rails.application.config.hosts << 'localhost:3000'
Rails.application.config.hosts << 'buysell.crespire.dev'
Rails.application.config.hosts << 'buysell-backend.crespire.dev'
