defmodule Pinpointr.RoomView do
  use Pinpointr.Web, :view

  def render("index.json", %{rooms: rooms}) do
    rooms
  end

  def render("show.json", %{room: room}) do
    room
  end
end