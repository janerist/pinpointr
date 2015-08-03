defmodule Pinpointr.Repo.Migrations.CreateLocation do
  use Ecto.Migration

  def change do
    create table(:locations) do
      add :name, :string, null: false
      add :latlng, :geometry, null: false
      add :room_id, references(:rooms), null: false

      timestamps
    end
  end
end
