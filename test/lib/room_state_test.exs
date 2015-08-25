defmodule Pinpointr.RoomStateTest do
  use ExUnit.Case
  alias Pinpointr.RoomState
  alias Pinpointr.Player

  test "start_link/1 sets initial state" do
    RoomState.start_link(1)

    state = RoomState.get_state(1)

    assert state.players == %HashDict{}
    assert state.game_state == :waiting_for_players 
  end

  test "add_player/2 adds a player" do
    RoomState.start_link(1)

    RoomState.add_player(1, "player1")
    players = RoomState.get_state(1).players

    assert Dict.size(players) == 1
    assert Dict.get(players, "player1") == %Player{name: "player1"}
  end

  test "add_player/2 changes game_state to :round_starting" do
    RoomState.start_link(1)

    RoomState.add_player(1, "player1")

    assert RoomState.get_state(1).game_state == :round_starting
  end

  test "remove_player/2 removes a player" do
    RoomState.start_link(1)

    added_player = RoomState.add_player(1, "player1")
    removed_player = RoomState.remove_player(1, "player1")

    assert RoomState.get_state(1).players == %HashDict{}
    assert added_player == removed_player
  end

  test "remove_player/2 handles being passed non-existing player" do
    RoomState.start_link(1)

    RoomState.add_player(1, "player1")
    player = RoomState.remove_player(1, "fubar")
    state = RoomState.get_state(1)

    assert player == nil
    assert Dict.size(state.players) == 1
    assert state.game_state == :round_starting
  end

  test "remove_player/2 changes game_state to :waiting_for_players" do
    RoomState.start_link(1)

    RoomState.add_player(1, "player1")
    RoomState.remove_player(1, "player1")

    assert RoomState.get_state(1).game_state == :waiting_for_players
  end

  test "get_player/2 gets a player or nil" do
    RoomState.start_link(1)
    assert RoomState.get_player(1, "player1") == nil

    RoomState.add_player(1, "player1")
    assert RoomState.get_player(1, "player1") == %Player{name: "player1"}
  end

  test "player_ready/3 toggles player ready" do
    RoomState.start_link(1)

    RoomState.add_player(1, "player1")
    assert RoomState.get_player(1, "player1").ready == false

    RoomState.player_ready(1, "player1", true)
    assert RoomState.get_player(1, "player1").ready == true

    RoomState.player_ready(1, "player1", false)
    assert RoomState.get_player(1, "player1").ready == false
  end
end
