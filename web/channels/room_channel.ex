defmodule Pinpointr.RoomChannel do
  use Pinpointr.Web, :channel

  alias Pinpointr.Repo
  alias Pinpointr.Room
  alias Pinpointr.User
  alias Pinpointr.UserStore
  alias Phoenix.Socket

  def join("rooms:lobby", _auth_msg, socket) do
    rooms = Repo.all(Room) |> Enum.map(&room_transform/1)
    {:ok, %{rooms: rooms}, socket}
  end

  def join("rooms:" <> _room_id = room, %{"name" => name}, socket) do
    if UserStore.name_taken?(room, name) do
      {:error, %{"reason" => "Name is taken. Please choose another one."}}
    else
      user = %User{name: name}
      UserStore.add_user(room, user)
      send(self, {:after_join, user})
      {:ok, %{users: UserStore.get_users(room)}, assign(socket, :name, name)}
    end
  end

  def handle_info({:after_join, user}, socket) do
    broadcast! socket, "user:joined", %{user: user}
    {:noreply, socket}
  end

  def terminate(_reason, %Socket{topic: "rooms:lobby"}) do
   # Do nothing when leaving the lobby
  end
  def terminate(_reason, %Socket{assigns: assigns, topic: room} = socket) do
    user = UserStore.remove_user(room, assigns[:name])
    broadcast! socket, "user:left", %{user: user}
  end

  defp room_transform(room) do
    %{id: room.id,
       name: room.name,
       zxy: room.zxy,
       users: UserStore.get_users("rooms:" <> Integer.to_string room.id)}
  end
end
