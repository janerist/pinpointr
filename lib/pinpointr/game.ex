defmodule Pinpointr.Game do
  alias Pinpointr.Player

  def start_link(id, name) do
    Agent.start_link(fn -> %{
      id: id,
      name: name,
      players: HashDict.new,
      game_state: :waiting_for_players} 
    end)
  end

  def get_state(game), do: Agent.get(game, fn state -> state end)

  def add_player(game, name) do
    Agent.get_and_update(game, fn state ->
      player = %Player{name: name}
      {player, %{ state | players: Dict.put_new(state.players, name, player)}}
    end)
  end

  def remove_player(game, name) do
    Agent.get_and_update(game, fn state -> 
      player = Dict.get(state.players, name)
      {player, %{state | players: Dict.delete(state.players, name)}}
    end)
  end

  def update_player(game, name, fun) do
    Agent.get_and_update(game, fn state ->
      players = Dict.update!(state.players, name, fun)
      {Dict.get(players, name), %{state | players: players}}
    end)
  end

  def update_player_fields(game, name, fields) do
    update_player(game, name, fn player -> struct(player, fields) end)
  end
end