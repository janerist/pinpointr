defmodule Pinpointr do
  use Application

  # See http://elixir-lang.org/docs/stable/elixir/Application.html
  # for more information on OTP Applications
  def start(_type, _args) do
    import Supervisor.Spec, warn: false

    children = [
      # Start the endpoint when the application starts
      supervisor(Pinpointr.Endpoint, []),
      # Start the Ecto repository
      worker(Pinpointr.Repo, [])
      # Here you could define other workers and supervisors as children
      # worker(Pinpointr.Worker, [arg1, arg2, arg3]),
    ]

    # See http://elixir-lang.org/docs/stable/elixir/Supervisor.html
    # for other strategies and supported options
    opts = [strategy: :one_for_one, name: Pinpointr.Supervisor]
    {:ok, supervisor} = Supervisor.start_link(children, opts)

    # Pull rooms out of the database. We have use start_child
    # since we have to wait for the Repo to start.
    # Each room starts a child worker "Pinpointr.RoomState"
    Enum.map Pinpointr.Repo.all(Pinpointr.Room), fn room ->
      Supervisor.start_child(supervisor, 
                             worker(Pinpointr.RoomState, [room.id, room.name]))
    end

    {:ok, supervisor}
  end

  # Tell Phoenix to update the endpoint configuration
  # whenever the application is updated.
  def config_change(changed, _new, removed) do
    Pinpointr.Endpoint.config_change(changed, removed)
    :ok
  end
end
