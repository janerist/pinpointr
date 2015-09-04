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

  def find_distance_from(location, {lat2, lng2}) do
    {lat1, lng1} = location.latlng.coordinates
    r = 6371000
    x1 = lat2 - lat1
    x2 = lng2 - lng1
    dlat = to_radians x1
    dlng = to_radians x2
    a = :math.sin(dlat/2)*:math.sin(dlat/2)+:math.cos(to_radians lat1)*:math.cos(to_radians lat2)*:math.sin(dlng/2)*:math.sin(dlng/2)
    c = 2 * :math.atan2(:math.sqrt(a), :math.sqrt(1-a))
    r * c
  end

  defp to_radians(x) do
    x * :math.pi / 180.0
  end
end
