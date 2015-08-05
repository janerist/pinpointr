defmodule Pinpointr.RoomView do
  use Pinpointr.Web, :view

  def render("scripts.index.html", _assigns) do
    """
    <script>require("web/static/js/lobby")</script>
    """
  end

  def render("scripts.room.html", assigns) do
    """
    <script>var _room_id = #{assigns.room_id};</script>
    <script>require("web/static/js/room")</script>
    """
  end
end
