defmodule Pinpointr.RoomRegistry do
  use GenServer
  alias Pinpointr.GameServer

  # Client API
  def start_link(opts \\ []) do
    GenServer.start_link(__MODULE__, :ok, opts)
  end

  def lookup(server, room_id) do
    GenServer.call(server, {:lookup, room_id})
  end

  def create(server, room_id, room_name, locs) do
    GenServer.call(server, {:create, room_id, room_name, locs})
  end

  # Server callbacks
  def init(:ok) do
    {:ok, HashDict.new}
  end

  def handle_call({:lookup, room_id}, _from, rooms) do
    {:reply, HashDict.fetch(rooms, room_id), rooms}
  end

  def handle_call({:create, room_id, room_name, locs}, _from, rooms) do
    if HashDict.has_key?(rooms, room_id) do
      {:reply, HashDict.fetch(rooms, room_id), rooms}
    else
      {:ok, game} = GameServer.start_link(room_id, room_name, locs)
      {:reply, game, HashDict.put(rooms, room_id, game)}
    end
  end
end