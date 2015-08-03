defmodule Pinpointr.Repo.Migrations.CreateRoom do
  use Ecto.Migration

  def change do
    create table(:rooms) do
      add :name, :string, null: false
      add :zxy, :string, null: false

      timestamps
    end
  end
end
