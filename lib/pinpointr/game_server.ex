defmodule Pinpointr.GameServer do
  use GenServer
  alias Pinpointr.Player
  alias Pinpointr.Countdown
  alias Pinpointr.Endpoint
  alias Pinpointr.Location
  alias Pinpointr.Score

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

  def pinpoint(game, name, latlng) do
    GenServer.call(game, {:pinpoint, name, latlng})
  end

  # Server callbacks
  # --------------------------------------------------------------------------
  def init({id, name}) do
    {:ok, %{id: id,
            name: name,
            locs: [],
            players: HashDict.new,
            game_state: :waiting_for_players,
            num_rounds: nil,
            current_loc: nil,
            countdown: nil}}
  end

  def handle_call(:get_state, _from, state) do
    {:reply, get_room_state(state), state}
  end

  def handle_call({:add_player, name}, _from, state) do
    cond do
      String.length(name) > 20 ->
        {:reply, {:error, :name_too_long}, state}

      HashDict.has_key?(state.players, name)  ->
        {:reply, {:error, :name_taken}, state}

      true ->
        player = %Player{name: name}
        new_state = %{state | players: HashDict.put(state.players, name, player)}
        if state.game_state == :waiting_for_players do
          new_state = change_gs(:game_starting, new_state)
        end
        {:reply, {:ok, player}, new_state}
    end
  end

  def handle_call({:remove_player, name}, _from, state) do
    player = Dict.get(state.players, name)
    new_state = %{state | players: HashDict.delete(state.players, name)}

    if HashDict.size(new_state.players) == 0 do
      new_state = change_gs(:waiting_for_players, new_state)
    end

    {:reply, player, new_state}
  end

  def handle_call({:update_player, name, fun}, _from, state) do
    players = Dict.update!(state.players, name, fun)
    player = HashDict.get(players, name)
    new_state = %{state | players: players}
    {:reply, player, new_state}
  end

  def handle_call({:pinpoint, name, latlng}, _from, state) do
    cond do
      state.game_state != :round_started ->
        {:reply, :invalid, state}

      HashDict.get(state.players, name).round_points ->
        {:reply, :already_pinpointed, state}

      true ->
        distance = Location.find_distance_from(state.current_loc, latlng)
        time_used = Countdown.time_since_start(state.countdown)
        points = Score.calculate(distance, time_used)

        players = HashDict.update! state.players, name, fn p ->
          %Player{p |
          round_distance: distance,
          round_time: time_used,
          round_points: points,
          points: p.points + points}
        end

        {lat, lng} = state.current_loc.latlng.coordinates
        reply = %{
          player_name: name,
          time_used: time_used,
          distance: distance,
          points: points,
          target_latlng: [lat, lng]
        }

        {:reply, reply, %{state | players: players}}
    end
  end

  # Messages
  # --------------------------------------------------------------------------
  def handle_info({:countdown, :finished, next_gs}, state) do
    {:noreply, change_gs(next_gs, %{state | countdown: nil})}
  end
  def handle_info({:countdown, countdown, next_gs}, state) do
    if all_players_ready?(state.players) do
      Countdown.stop(state.countdown)
      {:noreply, change_gs(next_gs, %{state | countdown: nil})}
    else
      broadcast_to_room(state.id, "game:countdown", %{countdown: countdown})
      {:noreply, state}
    end
  end

  # Game state change handlers
  #---------------------------------------------------------------------------
  defp change_gs(new_gs, state) do
    handle_gs_changed(new_gs, %{state | game_state: new_gs})
  end

  defp handle_gs_changed(:waiting_for_players, state) do
    if state.countdown do
      Countdown.stop(state.countdown)
    end
    %{state | countdown: nil, current_loc: nil}
  end

  defp handle_gs_changed(:game_starting, state) do
    players = reset_players_for_game(state.players)
    locs = Location.get_locs(state.id)
    num_rounds = length(locs)
    broadcast_to_room(state.id,
                      "game:gameStarting",
                      %{game_state: state.game_state,
                        num_rounds: num_rounds,
                        players: HashDict.values(players)})

    %{state | 
      countdown: Countdown.start(10, :round_starting),
      locs: locs,
      num_rounds: num_rounds,
      players: players}
  end

  defp handle_gs_changed(:round_starting, state) do
    players = reset_players_for_round(state.players)

    :random.seed(:os.timestamp)
    [next_loc | locs] = Enum.shuffle(state.locs)

    broadcast_to_room(state.id,
                      "game:roundStarting",
                      %{game_state: state.game_state,
                        round: state.num_rounds - length(locs), 
                        players: HashDict.values(players)})
    %{state |
      countdown: Countdown.start(10, :round_started),
      locs: locs,
      current_loc: next_loc,
      players: players}
  end

  defp handle_gs_changed(:round_started, state) do
    players = set_all_players_not_ready(state.players)

    broadcast_to_room(state.id,
                      "game:roundStarted",
                      %{game_state: state.game_state,
                        players: HashDict.values(players),
                        loc: state.current_loc.name})
    %{state |
      countdown: Countdown.start(15, :round_finished),
      players: players}
  end

  defp handle_gs_changed(:round_finished, state) do
    players = set_all_players_not_ready(state.players)
    broadcast_to_room(state.id,
                      "game:roundFinished",
                      %{game_state: state.game_state,
                        players: HashDict.values(players)})

    next_gs = case length(state.locs) do
      0 -> :game_ended
      _ -> :round_starting
    end

    %{state |
      countdown: Countdown.start(10, next_gs),
      players: players,
      current_loc: nil}
  end

  defp handle_gs_changed(:game_ended, state) do
    players = set_all_players_not_ready(state.players)
    broadcast_to_room(state.id,
                      "game:gameEnded",
                      %{game_state: state.game_state,
                        players: HashDict.values(players)}) 

    %{state | 
      countdown: Countdown.start(15, :game_starting), 
      players: players}
  end

  # Private helper functions
  # --------------------------------------------------------------------------
  defp get_room_state(state) do
    %{
      id: state.id,
      name: state.name,
      players: HashDict.values(state.players),
      game_state: state.game_state,
      num_rounds: state.num_rounds,
      round: if state.num_rounds do state.num_rounds - length(state.locs) end,
      current_loc: if state.current_loc do state.current_loc.name end 
    }
  end

  defp broadcast_to_room(room_id, message, args) do
    Endpoint.broadcast!("rooms:" <> to_string(room_id), message, args)
  end

  defp all_players_ready?(players) do
    HashDict.values(players)
    |> Enum.all? fn player -> player.ready end
  end

  defp set_all_players_not_ready(players) do
    for {n, p} <- players, into: HashDict.new, do: {n, %Player{p | ready: false}}
  end

  defp reset_players_for_round(players) do
    for {n, p} <- players,
      into: HashDict.new,
      do: {n, %Player{p |
                      ready: false,
                      round_distance: nil,
                      round_time: nil,
                      round_points: nil}}
  end

  defp reset_players_for_game(players) do
    for {n, p} <- players,
      into: HashDict.new,
      do: {n, %Player{p | ready: false, points: 0}}
  end
end