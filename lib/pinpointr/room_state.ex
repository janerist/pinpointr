defmodule Pinpointr.RoomState do
  alias Pinpointr.Player

  def start_link(id, name) do
    Agent.start_link(fn -> %{
      id: id,
      name: name,
      players: HashDict.new,
      game_state: :waiting_for_players} 
    end, name: room(id))
  end

  def get_state(room_id), do: Agent.get(room(room_id), fn state -> state end)

  def add_player(room_id, name) do
    Agent.get_and_update(room(room_id), fn state ->
      player = %Player{name: name}
      {player, %{ state | players: Dict.put_new(state.players, name, player)}}
    end)
  end

  def remove_player(room_id, name) do
    Agent.get_and_update(room(room_id), fn state -> 
      player = Dict.get(state.players, name)
      {player, %{state | players: Dict.delete(state.players, name)}}
    end)
  end

  def update_player(room_id, name, fun) do
    Agent.get_and_update(room(room_id), fn state ->
      players = Dict.update!(state.players, name, fun)
      {Dict.get(players, name), %{state | players: players}}
    end)
  end

  def update_player_fields(room_id, name, fields) do
    update_player(room_id, name, fn player -> struct(player, fields) end)
  end

  defp room(room_id) do
    String.to_atom("room_" <> to_string room_id)
  end
end