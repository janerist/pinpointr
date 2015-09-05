defmodule Pinpointr.GameServerTest do
  use ExUnit.Case
  alias Pinpointr.GameServer
  alias Pinpointr.Player
  alias Pinpointr.Location

  setup do
    {:ok, game} = GameServer.start_link(1, "TestRoom", [%Location{name: "Test"}])
    {:ok, game: game}
  end

  test "start_link/1 sets initial state", %{game: game} do
    state = GameServer.get_state(game)

    assert state.id == 1
    assert state.name == "TestRoom"
    assert state.players == []
    assert state.game_state == :waiting_for_players 
    assert state.current_loc == nil
  end

  test "add_player/2 adds a player", %{game: game} do
    {:ok, _player} = GameServer.add_player(game, "p1")
    players = GameServer.get_state(game).players

    assert length(players) == 1
    assert List.first(players) == %Player{name: "p1"}
  end

  test "add_player/2 checks if player exists", %{game: game} do
    GameServer.add_player(game, "p1")
    assert GameServer.add_player(game, "p1") == {:error, :name_taken}
  end

  test "add_player/2 checks if name is too long", %{game: game} do
    assert GameServer.add_player(game, "jjgwkgjrellgkjerlgkjeklrgjelrkgj") == 
      {:error, :name_too_long} 
  end

  test "remove_player/2 removes a player", %{game: game} do
    {:ok, added_player} = GameServer.add_player(game, "p1")
    removed_player = GameServer.remove_player(game, "p1")

    assert GameServer.get_state(game).players == []
    assert added_player == removed_player
  end

  test "remove_player/2 handles being passed non-existing player", 
       %{game: game} do
    GameServer.add_player(game, "p1")
    player = GameServer.remove_player(game, "fubar")
    state = GameServer.get_state(game)

    assert player == nil
    assert length(state.players) == 1
  end

  test "update player_fields/3 updates player fields", %{game: game} do
    GameServer.add_player(game, "p1")
    
    assert List.first(get_players(game)).ready == false
    GameServer.update_player_fields(game, "p1", ready: true)
    assert List.first(get_players(game)).ready == true

    GameServer.update_player_fields(game, "p1", ready: false, points: 100)
    assert List.first(get_players(game)).ready == false
    assert List.first(get_players(game)).points == 100
  end

  test "update_playeer/3 updates player", %{game: game} do
    GameServer.add_player(game, "p1")

    GameServer.update_player(game, "p1", fn player -> 
      %Player{points: player.points + 10}
    end)

    assert List.first(get_players(game)).points == 10
  end

  defp get_players(game) do
    GameServer.get_state(game).players
  end
end
