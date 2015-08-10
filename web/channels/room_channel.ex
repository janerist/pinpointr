defmodule Pinpointr.RoomChannel do
  use Pinpointr.Web, :channel

  alias Pinpointr.Repo
  alias Pinpointr.Room
  alias Pinpointr.RoomState
  alias Phoenix.Socket
  alias Pinpointr.Endpoint

  def join("rooms:lobby", _auth_msg, socket) do
    {:ok, %{rooms: get_room_list}, socket}
  end

  def join("rooms:" <> room_id, %{"name" => name}, socket) do
    if RoomState.get_player(room_id, name) do
      {:error, %{"reason" => "Name is taken. Please choose another one."}}
    else
      player = RoomState.add_player(room_id, name)
      send(self, {:after_join, player})
      {:ok, %{players: RoomState.get_players(room_id)}, assign(socket, :name, name)}
    end
  end

  def handle_info({:after_join, player}, socket) do
    broadcast! socket, "player:joined", %{player: player}
    broadcast_room_updated_to_lobby
    {:noreply, socket}
  end

  def terminate(_reason, %Socket{topic: "rooms:lobby"}) do
   # Do nothing when leaving the lobby
  end
  def terminate(_reason, %Socket{assigns: assigns, topic: "rooms:" <> room_id} = socket) do
    player = RoomState.remove_player(room_id, assigns[:name])
    broadcast! socket, "player:left", %{player: player}
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
         players: RoomState.get_players room.id
      } end
  end
end
