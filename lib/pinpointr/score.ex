defmodule Pinpointr.Score do
  def calculate(distance, time_used) do
    s = (150 - (time_used / 100)) * 0.6 + (250 - distance) * 0.4
    if s < 0 do 0 else Float.round(s) end
  end
end