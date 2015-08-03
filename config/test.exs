use Mix.Config

# We don't run a server during test. If one is required,
# you can enable the server option below.
config :pinpointr, Pinpointr.Endpoint,
  http: [port: 4001],
  server: false

# Print only warnings and errors during test
config :logger, level: :warn

# Configure your database
config :pinpointr, Pinpointr.Repo,
  adapter: Ecto.Adapters.Postgres,
  username: "janerist",
  password: "",
  database: "pinpointr_test",
  extensions: [{Geo.PostGIS.Extension, library: Geo}],
  pool: Ecto.Adapters.SQL.Sandbox
