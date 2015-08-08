defmodule Pinpointr.RoomController do
  use Pinpointr.Web, :controller

  alias Pinpointr.Repo
  alias Pinpointr.Room

  def index(conn, _params) do
    render conn, "index.html"
  end

  def room(conn, %{"id" => id}) do
    room = Repo.one(from r in Room, where: r.id == ^id)
    render conn, "room.html", room: room
  end
end
