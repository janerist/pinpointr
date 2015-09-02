defmodule Pinpointr.Countdown do
  def start(from, args) do
    from..0
    |> Enum.with_index
    |> Enum.each fn {c, i} ->
      message = case c do
        0 -> {:countdown, :finished, args}
        _ -> {:countdown, c, args}
      end
      :timer.send_after(i*1000, message)
    end
  end
end