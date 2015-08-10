defmodule Pinpointr.RoomChannel do
  use Pinpointr.Web, :channel

  alias Pinpointr.Repo
  alias Pinpointr.Room
  alias Pinpointr.User
  alias Pinpointr.UserStore
  alias Phoenix.Socket
  alias Pinpointr.Endpoint

  def join("rooms:lobby", _auth_msg, socket) do
    {:ok, %{rooms: get_room_list}, socket}
  end

  def join("rooms:" <> _room_id = room, %{"name" => name}, socket) do
    if UserStore.get_user(room, name) do
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
    broadcast_room_updated_to_lobby
    {:noreply, socket}
  end

  def terminate(_reason, %Socket{topic: "rooms:lobby"}) do
   # Do nothing when leaving the lobby
  end
  def terminate(_reason, %Socket{assigns: assigns, topic: room} = socket) do
    user = UserStore.remove_user(room, assigns[:name])
    broadcast! socket, "user:left", %{user: user}
    broadcast_room_updated_to_lobby
  end

  def handle_in("chat:message", %{"message" => message}, socket) do
    broadcast!(socket, "chat:message", 
               %{from: socket.assigns[:name], 
               message: message})
    {:noreply, socket}
  end

  defp broadcast_room_updated_to_lobby do
    Endpoint.broadcast_from!(self(), 
                             "rooms:lobby", 
                             "room:updated", 
                             %{rooms: get_room_list})
  end

  defp get_room_list do
    Repo.all(Room) |> Enum.map fn room -> 
      %{ id: room.id,
         name: room.name,
         zxy: room.zxy,
         users: UserStore.get_users "rooms:" <> to_string room.id
      } end
  end
end
