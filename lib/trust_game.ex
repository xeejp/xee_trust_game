defmodule TrustGame do
  use XeeThemeScript
  require Logger

  alias TrustGame.Host
  alias TrustGame.Participant
  alias TrustGame.Main
  alias TrustGame.Actions

  # Callbacks
  def script_type do
    :message
  end

  def install, do: nil

  def init do
    {:ok, %{"data" => %{
        game_page: "waiting",
        game_round: 1,
        game_point: 10,
        game_rate: 3,
        game_progress: 0,
        participants: %{},
        pairs: %{},
        trust_results: %{},
      }
    }}
  end

  def wrap_result({:ok, _} = result), do: result
  def wrap_result(result), do: Main.wrap(result)

  def join(data, id) do
    result = unless Map.has_key?(data.participants, id) do
      new = Main.new_participant()
      put_in(data, [:participants, id], new)
      |> Actions.join(id, new)
    else
      data
    end
    wrap_result(result)
  end
  
  # Host router
  def handle_received(data, %{"action" => action, "params" => params}) do
    Logger.debug("[Trust Game] #{action} #{inspect params}")
    result = case {action, params} do
      {"FETCH_CONTENTS", _} -> Host.fetch_contents(data)
      {"SYNC_GAME_PROGRESS", game_progress} -> Host.sync_game_progress(data, game_progress)
      {"SYNC_PARTICIPANTS_LENGTH", participants_length} -> Host.sync_participants_length(data, participants_length)
      {"SHOW_RESULTS", results} -> Host.show_results(data, results)
      {"MATCH", _} -> Host.match(data)
      {"RESET", _} -> Host.reset(data)
      {"CHANGE_PAGE", page} -> Host.change_page(data, page)
      {"CHANGE_GAME_ROUND", game_round} -> Host.change_game_round(data, game_round)
      {"CHANGE_GAME_POINT", game_point} -> Host.change_game_point(data, game_point)
      {"CHANGE_GAME_RATE", game_rate} -> Host.change_game_rate(data, game_rate)
      _ -> {:ok, %{"data" => data}}
    end
    wrap_result(result)
  end

  # Participant router
  def handle_received(data, %{"action" => action, "params" => params}, id) do
    Logger.debug("[Trust Game] #{action} #{inspect params}")
    result = case {action, params} do
      {"FETCH_CONTENTS", _} -> Participant.fetch_contents(data, id)
      {"SYNC_INV_TEMP", inv_temp} -> Participant.sync_inv_temp(data, id, inv_temp)
      {"FINISH_INVESTING", inv_final} -> Participant.finish_investing(data, id, inv_final)
      {"SYNC_RES_TEMP", res_temp} -> Participant.sync_res_temp(data, id, res_temp)
      {"FINISH_RESPONDING", res_final} -> Participant.finish_responding(data, id, res_final)
      _ -> {:ok, %{"data" => data}}
    end
    wrap_result(result)
  end
end