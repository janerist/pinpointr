use Mix.Config

# In this file, we keep production configuration that
# you likely want to automate and keep it away from
# your version control system.
config :pinpointr, Pinpointr.Endpoint,
  secret_key_base: System.get_env("PINPOINTR_SECRET") 

# Configure your database
config :pinpointr, Pinpointr.Repo,
  adapter: Ecto.Adapters.Postgres,
  extensions: [{Geo.PostGIS.Extension, library: Geo}],
  url: {:system, "PINPOINTR_DB_URL"},
  pool_size: 20
