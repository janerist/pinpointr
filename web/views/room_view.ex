defmodule Pinpointr.RoomView do
  use Pinpointr.Web, :view

  def render("scripts.index.html", _assigns) do
    """
    <script>require("web/static/js/lobby")</script>
    """
  end

  def render("scripts.room.html", assigns) do
    """
    <script>window.__room = #{Poison.encode!(assigns.room)};</script>
    <script>require("web/static/js/room")</script>
    """
  end
end
