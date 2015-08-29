defmodule Pinpointr.RoomChannel do
  use Pinpointr.Web, :channel

  alias Pinpointr.Repo
  alias Pinpointr.Room
  alias Pinpointr.Game
  alias Phoenix.Socket
  alias Pinpointr.Endpoint

  def join("rooms:lobby", _auth_msg, socket) do
    {:ok, %{rooms: get_room_list}, socket}
  end

  def join("rooms:" <> room_id, %{"name" => name}, socket) do
    game = get_game(room_id)
    if Game.get_state(game).players[name] do
      {:error, %{"reason" => "Name is taken. Please choose another one."}}
    else
      player = Game.add_player(game, name)
      send(self, {:after_join, player})
      {:ok, get_state(game), assign(socket, :name, name)}
    end
  end

  def handle_info({:after_join, player}, 
                  socket = %Socket{topic: "rooms:" <> room_id}) do
    broadcast! socket, "player:joined", %{player: player}
    broadcast_room_updated_to_lobby get_game(room_id)
    {:noreply, socket}
  end

  def terminate(_reason, %Socket{topic: "rooms:lobby"}) do
   # Do nothing when leaving the lobby
  end
  def terminate(_reason, 
                socket = %Socket{topic: "rooms:" <> room_id}) do
    game = get_game(room_id)
    player = Game.remove_player(game, socket.assigns[:name])
    broadcast! socket, "player:left", %{player: player}
    broadcast_room_updated_to_lobby game
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
    game = get_game(room_id)
    player = Game.update_player_fields(game, 
                                       socket.assigns[:name],
                                       ready: ready)
    broadcast!(socket, "player:ready", %{player: player})
    {:noreply, socket}
  end

  defp broadcast_room_updated_to_lobby(game) do
    Endpoint.broadcast_from!(self(), 
                             "rooms:lobby", 
                             "room:updated", 
                             %{room: get_state(game)})
  end

  defp get_room_list do
    Repo.all(Room) |> Enum.map fn room -> get_game(room.id) |> get_state end
  end

  defp get_state(game) do
    state = Game.get_state(game)
    %{state | players: Dict.values(state.players)}
  end

  defp get_game(room_id) do
    {:ok, game} = Pinpointr.RoomRegistry.lookup(Pinpointr.RoomRegistry,
      case room_id do 
        room_id when is_binary(room_id) -> String.to_integer(room_id)
        _ -> room_id
      end)
    game
  end
end
