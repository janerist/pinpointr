defmodule Pinpointr.RoomController do
  use Pinpointr.Web, :controller

  def index(conn, _params) do
    render conn, "index.html"
  end

  def room(conn, %{"id" => id}) do
    render conn, "room.html", room_id: id
  end
end
