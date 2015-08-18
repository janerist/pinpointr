defmodule Pinpointr.RoomState do
  alias Pinpointr.Player

  @initial_state %{ 
    players: HashDict.new, 
    game_state: :waiting_for_players} 

  def start_link(room_id) do
    Agent.start_link(fn -> @initial_state end, name: room(room_id))
  end

  def get_state(room_id) do
    Agent.get(room(room_id), fn state -> 
      state
    end)
  end

  def add_player(room_id, name) do
    Agent.get_and_update(room(room_id), fn state ->
      player = %Player{name: name}
      {player, %{
        state | 
        players: Dict.put_new(state.players, name, player),
        game_state: 
          case state.game_state do
            :waiting_for_players -> :game_countdown
            _ -> state.game_state
          end}}
    end)
  end

  def remove_player(room_id, name) do
    Agent.get_and_update(room(room_id), fn state -> 
      player = Dict.get(state.players, name)
      {player, %{
        state | 
        players: Dict.delete(state.players, name),
        game_state:
          case {Dict.size(state.players), player} do
            {1, %Player{}} -> :waiting_for_players
            _ -> state.game_state
          end}}
    end)
  end

  def get_player(room_id, name) do
    Agent.get(room(room_id), fn state ->
      Dict.get(state.players, name)
    end)
  end

  defp room(room_id) do
    String.to_atom("room_" <> to_string room_id)
  end
end