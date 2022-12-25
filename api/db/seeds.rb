# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the bin/rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: "Star Wars" }, { name: "Lord of the Rings" }])
#   Character.create(name: "Luke", movie: movies.first)

user = Account.create(status: 'verified', name: 'user1', email: 'test1@test.com', password: 'pass1234', admin: true)
user.posts.build(title: 'Test Title', body: 'Test Body Content', status: 'published').save

Account.create(status: 'verified', name: 'user2', email: 'test2@test.com', password: 'pass1234')
