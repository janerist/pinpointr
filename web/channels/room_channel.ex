defmodule Pinpointr.RoomChannel do
  use Pinpointr.Web, :channel

  alias Pinpointr.RoomRegistry
  alias Pinpointr.GameServer
  alias Pinpointr.Endpoint

  # Join
  # --------------------------------------------------------------------------
  def join("rooms:" <> _room_id, %{"name" => name}, socket) do
    game = get_game(socket.topic)
    case GameServer.add_player(game, name) do
      {:error, :name_taken} ->
        {:error, %{"reason" => "Name is taken. Please choose another one."}}

      {:error, :name_too_long} ->
        {:error, %{"reason" => "Name is too long. Max 20 characters please."}}

      {:ok, player} -> 
        send(self, {:after_join, game, player})
        {:ok, GameServer.get_state(game), assign(socket, :name, name)}
    end
  end

  # Terminate
  # --------------------------------------------------------------------------
  def terminate(_reason, socket) do
    game = get_game(socket.topic)
    player = GameServer.remove_player(game, socket.assigns[:name])
    broadcast_from!(socket, "player:left", %{player: player})
    broadcast_room_updated_to_lobby(game)
  end

  # Message handlers 
  # --------------------------------------------------------------------------
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
    reply = case GameServer.pinpoint(game, socket.assigns[:name], {lat, lng}) do
      :invalid -> 
        {:error, :invalid}

      :already_pinpointed -> 
        {:error, :already_pinpointed}

      response -> 
        broadcast!(socket, "player:pinpoint", response)
        {:ok, response}
    end

    {:reply, reply, socket}
  end

  # Internal message handlers
  # --------------------------------------------------------------------------
  def handle_info({:after_join, game, player}, socket) do
    broadcast_from!(socket, "player:joined", %{player: player})
    broadcast_room_updated_to_lobby(game) 
    {:noreply, socket}
  end

  # Private helper functions
  # --------------------------------------------------------------------------
  defp broadcast_room_updated_to_lobby(game) do
    Endpoint.broadcast!("lobby", 
                        "room:updated", 
                        %{room: GameServer.get_state(game)})
  end

  defp get_game("rooms:" <> room_id) do
    {:ok, game} = RoomRegistry.lookup(Pinpointr.RoomRegistry,
                                      String.to_integer(room_id))
    game
  end
end