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

defmodule Seed do
  def insert_location(room_id, name, lat, lng) do
    Repo.insert!(%Location{room_id: room_id, 
                 name: name, 
                 latlng: %Point{coordinates: {lat, lng}}})
  end
end

room = Repo.insert!(%Room{
      name: "Trondheim",
      zxy: "12/63.4187362/10.4387621"})

Seed.insert_location(room.id, "Nidarøhallen", 63.4274784, 10.3766982)
Seed.insert_location(room.id, "Tyholttårnet", 63.4225, 10.431944)
Seed.insert_location(room.id, "Den Gode Nabo", 63.4280288, 10.4023898)
Seed.insert_location(room.id, "Studentersamfundet i Trondheim", 63.4224563, 10.3954536)
Seed.insert_location(room.id, "Nidaros Domkirke", 63.4269097, 10.3969374)
Seed.insert_location(room.id, "Prinsen Kinosenter", 63.427057, 10.392525)
Seed.insert_location(room.id, "Trondheim Torg", 63.4300545, 10.3934666)
Seed.insert_location(room.id, "Munkholmen", 63.4523458, 10.3845799)
Seed.insert_location(room.id, "St. Olavs Hospital", 63.4210376, 10.3880388)
Seed.insert_location(room.id, "Vitensenteret i Trondheim", 63.4302843, 10.4000911)
Seed.insert_location(room.id, "Nova Kinosenter", 63.4327851, 10.4017652)
Seed.insert_location(room.id, "Dødens dal", 63.4188291, 10.4066801)
Seed.insert_location(room.id, "Lerkendal Stadion", 63.4123278, 10.4044709)
Seed.insert_location(room.id, "Bugatti Drive-Thru", 63.4242223, 10.4411117)
Seed.insert_location(room.id, "IKEA Leangen", 63.428636, 10.473792)
Seed.insert_location(room.id, "City Syd", 63.3615832, 10.3777885)
Seed.insert_location(room.id, "Kristiansten Festning", 63.4268954, 10.4105904)
Seed.insert_location(room.id, "Sirkus Shopping", 63.436271, 10.456035)
Seed.insert_location(room.id, "Leangen Travbane", 63.4302648, 10.4709285)
Seed.insert_location(room.id, "Granåsen hoppbakke", 63.3762174, 10.3051972)