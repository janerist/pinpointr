defmodule Pinpointr.Location do
  use Pinpointr.Web, :model

  schema "locations" do
    field :name, :string
    field :latlng, Geo.Point

    timestamps

    belongs_to :room, Pinpointr.Room
  end

  @required_fields ~w(name latlng room_id)
  @optional_fields ~w()

  @doc """
  Creates a changeset based on the `model` and `params`.

  If no params are provided, an invalid changeset is returned
  with no validation performed.
  """
  def changeset(model, params \\ :empty) do
    model
    |> cast(params, @required_fields, @optional_fields)
  end
end
