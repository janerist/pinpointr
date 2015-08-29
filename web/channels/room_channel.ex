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
    if RoomState.get_state(room_id).players[name] do
      {:error, %{"reason" => "Name is taken. Please choose another one."}}
    else
      player = RoomState.add_player(room_id, name)
      send(self, {:after_join, player})
      {:ok, get_room_state(room_id), assign(socket, :name, name)}
    end
  end

  def handle_info({:after_join, player}, 
                  socket = %Socket{topic: "rooms:" <> room_id}) do
    broadcast! socket, "player:joined", %{player: player}
    broadcast_room_updated_to_lobby room_id
    {:noreply, socket}
  end

  def terminate(_reason, %Socket{topic: "rooms:lobby"}) do
   # Do nothing when leaving the lobby
  end
  def terminate(_reason, 
                socket = %Socket{topic: "rooms:" <> room_id}) do
    player = RoomState.remove_player(room_id, socket.assigns[:name])
    broadcast! socket, "player:left", %{player: player}
    broadcast_room_updated_to_lobby room_id
  end

  def handle_in("chat:message", %{"message" => message}, socket) do
    broadcast!(socket, "chat:message", 
               %{from: socket.assigns[:name], 
               message: message})
    {:noreply, socket}
  end

  def handle_in("player:ready", 
                %{"ready" => ready}, 
                socket = %Socket{topic: "rooms:" <> room_id}) do
    player = RoomState.update_player_fields(room_id, 
                                            socket.assigns[:name],
                                            ready: ready)
    broadcast!(socket, "player:ready", %{player: player})
    {:noreply, socket}
  end

  defp broadcast_room_updated_to_lobby(room_id) do
    Endpoint.broadcast_from!(self(), 
                             "rooms:lobby", 
                             "room:updated", 
                             %{room: get_room_state(room_id)})
  end

  defp get_room_list do
    Repo.all(Room) |> Enum.map fn room -> get_room_state(room.id) end
  end

  defp get_room_state(room_id) do
    state = RoomState.get_state(room_id)
    %{state | players: Dict.values(state.players)}
  end
end
