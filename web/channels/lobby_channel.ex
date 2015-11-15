defmodule Pinpointr.LobbyChannel do
  use Pinpointr.Web, :channel

  alias Pinpointr.RoomRegistry
  alias Pinpointr.GameServer

  def join("lobby", _auth_msg, socket) do
    {:ok, %{rooms: get_rooms}, socket}
  end

  defp get_rooms do
    RoomRegistry.get_all(Pinpointr.RoomRegistry)
    |> Enum.map &GameServer.get_state/1
  end
end
