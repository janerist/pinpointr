defmodule Pinpointr.RoomController do
  use Pinpointr.Web, :controller

  alias Pinpointr.Room

  def index(conn, _params) do
    rooms = Repo.all(Room)
    render conn, rooms: rooms 
  end

  def show(conn, %{"id" => id}) do
    room = Repo.one(from r in Room, 
                    where: r.id == ^id)

    if room do
      render conn, room: room
    else
      conn 
        |> put_status(:not_found)
        |> render(Pinpointr.ErrorView, "404.json")
    end
  end
end