defmodule Pinpointr.Countdown do
  def start(from, args) do
    from..0
    |> Enum.with_index
    |> Enum.map fn {c, i} ->
      message = case c do
        0 -> {:countdown, :finished, args}
        _ -> {:countdown, c, args}
      end
      {:ok, tref} = :timer.send_after(i*1000, message)
      tref
    end
  end

  def stop(trefs) do
    Enum.each trefs, &:timer.cancel/1
    :ok
  end
end