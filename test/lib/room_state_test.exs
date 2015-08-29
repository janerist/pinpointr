defmodule Pinpointr.RoomStateTest do
  use ExUnit.Case
  alias Pinpointr.RoomState
  alias Pinpointr.Player

  test "start_link/1 sets initial state" do
    RoomState.start_link(1, "TestRoom")
    state = RoomState.get_state(1)

    assert state.id == 1
    assert state.name == "TestRoom"
    assert state.players == %HashDict{}
    assert state.game_state == :waiting_for_players 
  end

  test "add_player/2 adds a player" do
    RoomState.start_link(1, "TestRoom")

    RoomState.add_player(1, "player1")
    players = RoomState.get_state(1).players

    assert Dict.size(players) == 1
    assert Dict.get(players, "player1") == %Player{name: "player1"}
  end

  test "remove_player/2 removes a player" do
    RoomState.start_link(1, "TestRoom")

    added_player = RoomState.add_player(1, "player1")
    removed_player = RoomState.remove_player(1, "player1")

    assert RoomState.get_state(1).players == %HashDict{}
    assert added_player == removed_player
  end

  test "remove_player/2 handles being passed non-existing player" do
    RoomState.start_link(1, "TestRoom")

    RoomState.add_player(1, "player1")
    player = RoomState.remove_player(1, "fubar")
    state = RoomState.get_state(1)

    assert player == nil
    assert Dict.size(state.players) == 1
  end

  test "update player_fields/3 updates player fields" do
    RoomState.start_link(1, "TestRoom")

    RoomState.add_player(1, "player1")
    
    assert RoomState.get_state(1).players["player1"].ready == false
    RoomState.update_player_fields(1, "player1", ready: true)
    assert RoomState.get_state(1).players["player1"].ready == true

    RoomState.update_player_fields(1, "player1", ready: false, points: 100)
    assert RoomState.get_state(1).players["player1"].ready == false
    assert RoomState.get_state(1).players["player1"].points == 100
  end

  test "update_playeer/3 updates player" do
    RoomState.start_link(1, "TestRoom")
    RoomState.add_player(1, "player1")

    RoomState.update_player(1, "player1", fn player -> 
      %Player{points: player.points + 10}
    end)

    assert RoomState.get_state(1).players["player1"].points == 10
  end
end
