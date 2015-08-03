defmodule Pinpointr.LocationTest do
  use Pinpointr.ModelCase

  alias Pinpointr.Location

  @valid_attrs %{
    latlng: %Geo.Point{coordinates: {63, 10}},
    name: "some content",
    room_id: 2}
  @invalid_attrs %{}

  test "changeset with valid attributes" do
    changeset = Location.changeset(%Location{}, @valid_attrs)
    assert changeset.valid?
  end

  test "changeset with invalid attributes" do
    changeset = Location.changeset(%Location{}, @invalid_attrs)
    refute changeset.valid?
  end
end
