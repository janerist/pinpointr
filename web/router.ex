defmodule Pinpointr.Router do
  use Pinpointr.Web, :router

  pipeline :browser do
    plug :accepts, ["html"]
    plug :fetch_session
    plug :fetch_flash
    plug :protect_from_forgery
  end

  pipeline :api do
    plug :accepts, ["json"]
  end

  scope "/", Pinpointr do
    pipe_through :browser # Use the default browser stack

    get "/", RoomController, :index
    get "/rooms/:id", RoomController, :room
  end


  # Other scopes may use custom stacks.
  # scope "/api", Pinpointr do
  #   pipe_through :api
  # end
end
