defmodule Pinpointr.PageController do
  use Pinpointr.Web, :controller

  def index(conn, _params) do
    render conn, "index.html"
  end
end
