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
    case GameServer.add_player(game, name) do
      {:ok, player} -> 
        send(self, {:after_join, game, player})
        {:ok, GameServer.get_state(game), assign(socket, :name, name)}

      {:error, "Player name taken"} ->
        {:error, %{"reason" => "Name is taken. Please choose another one."}}
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
    broadcast!(socket, "player:updated", %{player: player})
    {:noreply, socket}
  end

  def handle_in("player:pinpoint", %{"latlng" => [lat, lng]}, socket) do
    game = get_game(socket.topic)
    case GameServer.pinpoint(game, socket.assigns[:name], {lat, lng}) do
      :already_pinpointed -> nil
      response -> broadcast!(socket, "player:pinpoint", response)
    end

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
    Endpoint.broadcast!("rooms:lobby", 
                        "room:updated", 
                        %{room: GameServer.get_state(game)})
  end

  defp get_game("rooms:" <> room_id) do
    {:ok, game} = Pinpointr.RoomRegistry.lookup(Pinpointr.RoomRegistry,
                                                String.to_integer(room_id))
    game
  end

  defp get_room_list do
    Repo.all(Room) 
    |> Enum.map(fn room -> "rooms:" <> to_string(room.id) end)
    |> Enum.map(&get_game/1)
    |> Enum.map(&GameServer.get_state/1)
  end
end
