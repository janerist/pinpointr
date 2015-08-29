defmodule Pinpointr.GameTest do
  use ExUnit.Case
  alias Pinpointr.Game
  alias Pinpointr.Player

  setup do
    {:ok, game} = Game.start_link(1, "TestRoom")
    {:ok, game: game}
  end

  test "start_link/1 sets initial state", %{game: game} do
    state = Game.get_state(game)

    assert state.id == 1
    assert state.name == "TestRoom"
    assert state.players == %HashDict{}
    assert state.game_state == :waiting_for_players 
  end

  test "add_player/2 adds a player", %{game: game} do
    Game.add_player(game, "player1")
    players = Game.get_state(game).players

    assert Dict.size(players) == 1
    assert Dict.get(players, "player1") == %Player{name: "player1"}
  end

  test "remove_player/2 removes a player", %{game: game} do
    added_player = Game.add_player(game, "player1")
    removed_player = Game.remove_player(game, "player1")

    assert Game.get_state(game).players == %HashDict{}
    assert added_player == removed_player
  end

  test "remove_player/2 handles being passed non-existing player", 
       %{game: game} do
    Game.add_player(game, "player1")
    player = Game.remove_player(game, "fubar")
    state = Game.get_state(game)

    assert player == nil
    assert Dict.size(state.players) == 1
  end

  test "update player_fields/3 updates player fields", %{game: game} do
    Game.add_player(game, "player1")
    
    assert Game.get_state(game).players["player1"].ready == false
    Game.update_player_fields(game, "player1", ready: true)
    assert Game.get_state(game).players["player1"].ready == true

    Game.update_player_fields(game, "player1", ready: false, points: 100)
    assert Game.get_state(game).players["player1"].ready == false
    assert Game.get_state(game).players["player1"].points == 100
  end

  test "update_playeer/3 updates player", %{game: game} do
    Game.add_player(game, "player1")

    Game.update_player(game, "player1", fn player -> 
      %Player{points: player.points + 10}
    end)

    assert Game.get_state(game).players["player1"].points == 10
  end
end
