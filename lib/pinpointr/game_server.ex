defmodule Pinpointr.GameServer do
  use GenServer
  alias Pinpointr.Player
  alias Pinpointr.Countdown
  alias Pinpointr.Endpoint

  # Client API
  # --------------------------------------------------------------------------
  def start_link(id, name, opts \\ []) do
    GenServer.start_link(__MODULE__, {id, name}, opts)
  end

  def get_state(game) do
    GenServer.call(game, :get_state)
  end

  def add_player(game, name) do
    GenServer.call(game, {:add_player, name})
  end

  def remove_player(game, name) do
    GenServer.call(game, {:remove_player, name})
  end

  def update_player(game, name, fun) do
    GenServer.call(game, {:update_player, name, fun})
  end

  def update_player_fields(game, name, fields) do
    update_player(game, name, fn player -> struct(player, fields) end)
  end

  # Server callbacks
  # --------------------------------------------------------------------------
  def init({id, name}) do
    {:ok, %{id: id,
            name: name,
            players: HashDict.new,
            game_state: :waiting_for_players,
            countdown: nil}}
  end

  def handle_call(:get_state, _from, state) do
    {:reply, get_room_state(state), state}
  end

  def handle_call({:add_player, name}, _from, state) do
    if HashDict.has_key?(state.players, name) do
      {:reply, {:error, "Player name taken"}, state}
    else
      player = %Player{name: name}
      new_state = %{state | players: HashDict.put(state.players, name, player)}
      if state.game_state == :waiting_for_players do
        new_state = %{new_state | game_state: :round_starting}
        new_state = handle_game_state_changed(new_state.game_state, new_state)
      end
      {:reply, {:ok, player}, new_state}
    end
  end

  def handle_call({:remove_player, name}, _from, state) do
    player = Dict.get(state.players, name)
    new_state = %{state | players: HashDict.delete(state.players, name)}

    if HashDict.size(new_state.players) == 0 do
      new_state = %{new_state | game_state: :waiting_for_players}
      new_state = handle_game_state_changed(new_state.game_state, new_state)
    end

    {:reply, player, new_state}
  end

  def handle_call({:update_player, name, fun}, _from, state) do
    players = Dict.update!(state.players, name, fun)
    player = HashDict.get(players, name)
    new_state = %{state | players: players}
    {:reply, player, new_state}
  end

  # Messages
  # --------------------------------------------------------------------------
  def handle_info({:countdown, :finished, next_gs}, state) do
    new_state = %{state | game_state: next_gs}
    new_state = handle_game_state_changed(next_gs, new_state)
    {:noreply, new_state}
  end
  def handle_info({:countdown, countdown, next_gs}, state) do
    if all_players_ready?(state.players) do
      new_state = %{state | game_state: next_gs}
      new_state = handle_game_state_changed(next_gs, new_state) 
      {:noreply, new_state}
    else
      broadcast_to_room(state.id, "game:countdown", %{countdown: countdown})
      {:noreply, state}
    end
  end

  # Game state change handlers
  #---------------------------------------------------------------------------
  def handle_game_state_changed(:waiting_for_players, state) do
    if state.countdown do
      Countdown.stop(state.countdown)
      %{state | countdown: nil}
    else
      state
    end
  end

  def handle_game_state_changed(:round_starting, state) do
    countdown = Countdown.start(10, :round_started)
    broadcast_to_room(state.id,
                      "game:roundStarting",
                      %{game_state: state.game_state})
    %{state | countdown: countdown} 
  end

  def handle_game_state_changed(:round_started, state) do
    players = 
      for {n, p} <- state.players, into: HashDict.new, do: {n, %Player{p | ready: false}}
    Countdown.stop(state.countdown)
    broadcast_to_room(state.id,
                      "game:roundStarted",
                      %{game_state: state.game_state, players: HashDict.values(players)})
    %{state | players: players, countdown: nil}
  end

  # Private helper functions
  # --------------------------------------------------------------------------
  defp get_room_state(state) do
    %{
      id: state.id,
      name: state.name,
      players: HashDict.values(state.players),
      game_state: state.game_state
    }
  end

  defp broadcast_to_room(room_id, message, args) do
    Endpoint.broadcast!("rooms:" <> to_string(room_id), message, args)
  end

  defp all_players_ready?(players) do
    HashDict.values(players)
    |> Enum.all? fn player -> player.ready end
  end

end
