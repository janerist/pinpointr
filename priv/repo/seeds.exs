# Script for populating the database. You can run it as:
#
#     mix run priv/repo/seeds.exs
#
# Inside the script, you can read and write to any of your
# repositories directly:
#
#     Pinpointr.Repo.insert!(%SomeModel{})
#
# We recommend using the bang functions (`insert!`, `update!`
# and so on) as they will fail if something goes wrong.
alias Pinpointr.Repo
alias Pinpointr.Room
alias Pinpointr.Location
alias Geo.Point

room = Repo.insert!(%Room{
      name: "Trondheim",
      zxy: "12/63.4187362/10.4387621"})

Repo.insert!(%Location{room_id: room.id, 
                       name: "Telenorbygget", 
                       latlng: %Point{coordinates: {63.421982,10.437698}}})

Repo.insert!(%Location{room_id: room.id, 
                       name: "Egon Tårnet", 
                       latlng: %Point{coordinates: {63.4223564,10.4319343}}})

Repo.insert!(%Location{room_id: room.id, 
                       name: "Den Gode Nabo", 
                       latlng: %Point{coordinates: {63.4280288,10.4023898}}})

Repo.insert!(%Location{room_id: room.id, 
                       name: "Studentersamfundet i Trondheim", 
                       latlng: %Point{coordinates: {63.4224563,10.3954536}}})
