defmodule Pinpointr.Countdown do
  def start(from, args) do
    trefs = from..0
    |> Enum.with_index
    |> Enum.map fn {c, i} ->
      message = case c do
        0 -> {:countdown, :finished, args}
        _ -> {:countdown, c, args}
      end
      {:ok, tref} = :timer.send_after(i*1000, message)
      tref
    end
    {trefs, :os.timestamp}
  end

  def stop({trefs, _timestamp}) do
    Enum.each trefs, &:timer.cancel/1
    :ok
  end

  def time_since_start({_trefs, timestamp}) do
    :timer.now_diff(:os.timestamp, timestamp) / 1000.0
  end
end