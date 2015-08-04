defmodule Pinpointr.RoomChannel do
  use Phoenix.Channel

  alias Pinpointr.Repo
  alias Pinpointr.Room

  def join("rooms:lobby", _auth_msg, socket) do
    rooms = Enum.map Repo.all(Room), fn r -> %{id: r.id,
                                               name: r.name,
                                               zxy: r.zxy,
                                               users: []} end
    {:ok, %{rooms: rooms}, socket}
  end
  def join("rooms:" <> room_id, _auth_msg, socket) do
    {:ok, socket}
  end

end
