defmodule Pinpointr.UserStore do
  def start_link() do
    Agent.start_link(fn -> HashDict.new end, name: __MODULE__)
  end

  def add_user(room, user) do
    Agent.update(__MODULE__, fn users ->
      if Dict.has_key?(users, room) do
        room_users = Dict.get(users, room)
        Dict.put(users, room, Set.put(room_users, user))
      else
        Dict.put_new(users, room, Set.put(HashSet.new, user))
      end
    end)
  end

  def remove_user(room, user) do
    Agent.update(__MODULE__, fn users ->
      room_users = Dict.get(users, room)
      Dict.put(users, room, Set.delete(room_users, user))
    end)
  end

  def get_users(room) do
    Agent.get(__MODULE__, fn users ->
      Dict.get(users, room) || HashSet.new
    end)
  end

  def name_taken?(room, user) do
    Agent.get(__MODULE__, fn users ->
      case Dict.get(users, room) do
        nil -> false
        room_users -> Set.member?(room_users, user)
      end
    end)
  end
end
