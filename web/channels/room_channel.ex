defmodule Pinpointr.RoomChannel do
  use Phoenix.Channel

  alias Pinpointr.Repo
  alias Pinpointr.Room

  def join("rooms:lobby", _auth_msg, socket) do
    {:ok, %{rooms: Repo.all(Room)}, socket}
  end
  def join("rooms:" <> room_id, _auth_msg, socket) do
    {:ok, socket}
  end

end
