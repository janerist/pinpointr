defmodule Pinpointr.RoomState do
  alias Pinpointr.Player

  @initial_state %{ 
    players: HashDict.new, 
    game_state: :waiting_for_players} 

  def start_link(room_id) do
    Agent.start_link(fn -> @initial_state end, name: room(room_id))
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

  def update_player(room_id, name, fields) do
    Agent.get_and_update(room(room_id), fn state ->
      players = Dict.update!(state.players, name, fn player ->
        struct(player, fields)
      end)
      {Dict.get(players, name), %{state | players: players}}
    end)
  end

  defp room(room_id) do
    String.to_atom("room_" <> to_string room_id)
  end
end