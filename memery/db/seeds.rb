# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: 'Star Wars' }, { name: 'Lord of the Rings' }])
#   Character.create(name: 'Luke', movie: movies.first)


user1 = User.create(name: "Adam")
user2 = User.create(name: "Jinming")

game1 = Game.create(user: user1, level: 1, score: 0)
game2 = Game.create(user: user2, level: 1, score: 10)
# game3 = Game.create(user: user1, level: 3, score: 100)
# game4 = Game.create(user: user1, level: 4, score: 4)
# game5 = Game.create(user: user1, level: 2, score: 20)