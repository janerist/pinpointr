defmodule Pinpointr.Room do
  use Pinpointr.Web, :model

  schema "rooms" do
    field :name, :string
    field :zxy, :string

    timestamps

    has_many :locations, Pinpointr.Location
  end

  @required_fields ~w(name zxy)
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

defimpl Poison.Encoder, for: Pinpointr.Room do
  def encode(room, options) do
    Poison.Encoder.Map.encode(%{id: room.id,
                                name: room.name,
                                zxy: room.zxy}, options)
  end
end
