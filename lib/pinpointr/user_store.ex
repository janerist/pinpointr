defmodule Pinpointr.User do
  defstruct name: nil, points: 0
end

defmodule Pinpointr.UserStore do
  def start_link() do
    Agent.start_link(fn -> HashDict.new end, name: __MODULE__)
  end

  def add_user(room, user) do
    Agent.update(__MODULE__, fn users ->
      if Dict.has_key?(users, room) do
        room_users = Dict.get(users, room)
        Dict.put(users, room, Dict.put_new(room_users, user.name, user))
      else
        Dict.put_new(users, room, Dict.put(HashDict.new, user.name, user))
      end
    end)
  end

  def remove_user(room, name) do
    Agent.update(__MODULE__, fn users ->
      room_users = Dict.get(users, room)
      Dict.put(users, room, Dict.delete(room_users, name))
    end)
  end

  def get_users(room) do
    Agent.get(__MODULE__, fn users ->
      case Dict.get(users, room) do
        nil -> []
        room_users -> Dict.values(room_users)
      end
    end)
  end

  def name_taken?(room, name) do
    Agent.get(__MODULE__, fn users ->
      case Dict.get(users, room) do
        nil -> false
        room_users -> Dict.has_key?(room_users, name)
      end
    end)
  end
end
