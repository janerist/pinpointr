defmodule Pinpointr.User do
  defstruct name: nil, points: 0
end

defmodule Pinpointr.UserStore do
  def start_link() do
    Agent.start_link(fn -> HashDict.new end, name: __MODULE__)
  end

  def add_user(room, user) do
    Agent.update(__MODULE__, fn users ->
      case Dict.get(users, room) do
        nil -> 
          Dict.put_new(users, room, Dict.put(HashDict.new, user.name, user))
        room_users -> 
          Dict.put(users, room, Dict.put_new(room_users, user.name, user))
      end
    end)
  end

  def remove_user(room, name) do
    Agent.get_and_update(__MODULE__, fn users ->
      room_users = Dict.get(users, room)
      user = Dict.get(room_users, name) 
      {user, Dict.put(users, room, Dict.delete(room_users, name))}
    end)
  end

  def get_user(room, name) do
    Agent.get(__MODULE__, fn users -> 
      case Dict.get(users, room) do
        nil -> nil
        room_users -> Dict.get(room_users, name)
      end
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
end
