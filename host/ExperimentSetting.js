import React, { Component } from 'react'
import { connect } from 'react-redux'

import {Card, CardActions, CardHeader, CardTitle, CardText} from 'material-ui/Card'
import RaisedButton from 'material-ui/RaisedButton';
import FloatingActionButton from 'material-ui/FloatingActionButton'
import ActionSettings from 'material-ui/svg-icons/action/settings'
import Dialog from 'material-ui/Dialog';

import Counter from 'components/Counter'

import { changeGameRound, changeGameRate , changeGamePoint} from './actions.js'

const mapStateToProps = ({ game_round, game_rate, game_point, game_page }) => ({  game_round,
  game_rate,
  game_point,
  game_page,
})

const styles = {
  block: {
    margin: '20px 20px'
  },
  game_roundButton: {
    margin: 12,
  },
};

class ExperimentSetting extends Component {
  constructor() {
    super()
    this.handleRound = this.handleRound.bind(this)
    this.handleRate = this.handleRate.bind(this)
    this.handlePoint = this.handlePoint.bind(this)
    this.handleOpen = this.handleOpen.bind(this)
    this.handleClose = this.handleClose.bind(this)
    this.handleConfirm = this.handleConfirm.bind(this)
    this.state = {
      open: false,
      game_round_temp: 1,
      game_rate: 3,
      game_point: 10,
    }
  }

  componentDidMount() {
    const { game_round, game_rate, game_point } = this.props
    this.setState({
      game_round_temp: game_round,
      game_rate_temp: game_rate,
      game_point_temp: game_point,
    })
  }

  handleOpen = () => {
    this.setState({open: true})
    const { game_round, game_rate, game_point } = this.props
    this.setState({
      game_round_temp: game_round,
      game_rate_temp: game_rate,
      game_point_temp: game_point,
    })
  };

  handleClose = () => {
    this.setState({open: false});
  };

  handleConfirm = () => {
    const { dispatch } = this.props
    const { game_round_temp, game_rate_temp, game_point_temp } = this.state
    dispatch(changeGameRound(game_round_temp))
    dispatch(changeGameRate(game_rate_temp))
    dispatch(changeGamePoint(game_point_temp));
  }

  handleNothing = (event) => {}

  handleRound = (event) => {
    const value = event.target.value
    const numValue = parseInt(value,10)
    this.setState({game_round_temp: numValue})
  }

  handleRate = (event) => {
    const value = event.target.value
    const numValue = parseInt(value,10)
    this.setState({game_rate_temp: numValue})
  }

  handlePoint = (event) => {
    const value = event.target.value
    const numValue = parseInt(value,10)
    this.setState({game_point_temp: numValue})
  }

  render() {
    const { game_page, game_round, game_rate, game_point } = this.props
    const { game_round_temp, game_rate_temp, game_point_temp } = this.state
    const actions = [
      <RaisedButton
        label="適用"
        primary={true}
        onTouchTap={this.handleConfirm}
　　　　style={{marginRight: "12px"}}
      />,
      <RaisedButton
        label="終了"
        onTouchTap={this.handleClose}
      />,
    ];

    return (
      <span>
          <FloatingActionButton
            onTouchTap={this.handleOpen}
            style={{marginRight: "12px"}}
            disabled={game_page != "waiting"}
          ><ActionSettings /></FloatingActionButton>
        <Dialog
          title="実験設定"
          actions={actions}
          modal={true}
          open={this.state.open}
          onRequestClose={this.handleClose}
        >
          <Counter
            title="ゲームラウンド数"
            value={game_round_temp}
            min={1}
            minTip="最小ラウンド"
            changeHandle={this.handleRound}
          />
          <Counter
            title="仲介者レート"
            value={game_rate_temp}
            min={1}
            minTip="最小レート"
            changeHandle={this.handleRate}
          />
          <Counter
            title="ラウンド開始時に配られるポイント"
            value={game_point_temp}
            min={1}
            minTip="最小ポイント"
            changeHandle={this.handlePoint}
          />
        </Dialog>
      </span>
    );
  }
}

export default connect(mapStateToProps)(ExperimentSetting)
