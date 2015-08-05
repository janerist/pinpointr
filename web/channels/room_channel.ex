defmodule Pinpointr.RoomChannel do
  use Pinpointr.Web, :channel

  alias Pinpointr.Repo
  alias Pinpointr.Room
  alias Pinpointr.UserStore
  alias Phoenix.Socket

  def join("rooms:lobby", _auth_msg, socket) do
    rooms = Repo.all(Room) |> Enum.map(&room_transform/1)
    {:ok, %{rooms: rooms}, socket}
  end

  def join(room = "rooms:" <> room_id, %{"name" => name}, socket) do
    if UserStore.name_taken?(room, name) do
      {:error, %{"reason" => "Name is taken. Please choose another one."}}
    else
      UserStore.add_user(room, name)
      db_room = (from r in Room, where: r.id == ^room_id) |> Repo.one
      {:ok, %{room: db_room |> room_transform}, assign(socket, :name, name)}
    end
  end

  def terminate(_reason, %Socket{topic: "rooms:lobby"}) do
   # Do nothing when leaving the lobby
  end
  def terminate(_reason, %Socket{assigns: assigns, topic: room}) do
    UserStore.remove_user(room, assigns[:name])
  end

  defp room_transform(room) do
    %{id: room.id,
       name: room.name,
       zxy: room.zxy,
       users: UserStore.get_users("rooms:" <> Integer.to_string room.id)}
  end
end
