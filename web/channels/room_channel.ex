defmodule Pinpointr.RoomChannel do
  use Pinpointr.Web, :channel

  alias Pinpointr.Repo
  alias Pinpointr.Room
  alias Pinpointr.GameServer
  alias Phoenix.Socket
  alias Pinpointr.Endpoint

  # Join
  # --------------------------------------------------------------------------
  def join("rooms:lobby", _auth_msg, socket) do
    {:ok, %{rooms: get_room_list}, socket}
  end
  def join("rooms:" <> _room_id, %{"name" => name}, socket) do
    game = get_game(socket.topic)
    if GameServer.get_state(game).players[name] do
      {:error, %{"reason" => "Name is taken. Please choose another one."}}
    else
      player = GameServer.add_player(game, name)
      send(self, {:after_join, game, player})
      {:ok, get_state(game), assign(socket, :name, name)}
    end
  end

  # Terminate
  # --------------------------------------------------------------------------
  def terminate(_reason, %Socket{topic: "rooms:lobby"}) do
   # Do nothing when leaving the lobby
  end
  def terminate(_reason, socket) do
    game = get_game(socket.topic)
    player = GameServer.remove_player(game, socket.assigns[:name])
    broadcast!(socket, "player:left", %{player: player})
    broadcast_room_updated_to_lobby(game)
  end

  # Message handlers 
  # --------------------------------------------------------------------------
  def handle_in("chat:message", %{"message" => message}, socket) do
    broadcast!(socket, "chat:message", %{from: socket.assigns[:name], 
                                         message: message})
    {:noreply, socket}
  end

  def handle_in("player:ready", %{"ready" => ready}, socket) do
    game = get_game(socket.topic)
    player = GameServer.update_player_fields(game, 
                                       socket.assigns[:name],
                                       ready: ready)
    broadcast!(socket, "player:ready", %{player: player})
    {:noreply, socket}
  end

  # Internal message handlers
  # --------------------------------------------------------------------------
  def handle_info({:after_join, game, player}, socket) do
    broadcast!(socket, "player:joined", %{player: player})
    broadcast_room_updated_to_lobby(game) 
    {:noreply, socket}
  end

  # Private helper functions
  # --------------------------------------------------------------------------
  defp broadcast_room_updated_to_lobby(game) do
    Endpoint.broadcast_from!(self(), 
                             "rooms:lobby", 
                             "room:updated", 
                             %{room: get_state(game)})
  end

  defp get_game("rooms:" <> room_id) do
    {:ok, game} = Pinpointr.RoomRegistry.lookup(Pinpointr.RoomRegistry,
                                                String.to_integer(room_id))
    game
  end

  defp get_state(game) do
    state = GameServer.get_state(game)
    %{state | players: Dict.values(state.players)}
  end

  defp get_room_list do
    Repo.all(Room) 
    |> Enum.map(fn room -> "rooms:" <> to_string(room.id) end)
    |> Enum.map(&get_game/1)
    |> Enum.map(&get_state/1)
  end
end
