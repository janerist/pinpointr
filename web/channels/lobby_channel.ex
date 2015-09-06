defmodule Pinpointr.LobbyChannel do
  use Pinpointr.Web, :channel

  alias Pinpointr.Repo
  alias Pinpointr.Room
  alias Pinpointr.RoomRegistry
  alias Pinpointr.GameServer

  def join("lobby", _auth_msg, socket) do
    {:ok, %{rooms: get_room_list}, socket}
  end
  
  defp get_room_list do
    Repo.all(Room) 
    |> Enum.map(fn room -> "rooms:" <> to_string(room.id) end)
    |> Enum.map(&get_game/1)
    |> Enum.map(&GameServer.get_state/1)
  end

  defp get_game("rooms:" <> room_id) do
    {:ok, game} = RoomRegistry.lookup(Pinpointr.RoomRegistry,
                                                String.to_integer(room_id))
    game
  end
end