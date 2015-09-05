defmodule Pinpointr.Player do
  defstruct name: nil, 
            points: 0,
            ready: false,
            round_distance: nil,
            round_time: nil,
            round_points: nil
end