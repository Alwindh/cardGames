import React, { Component } from 'react';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import TextField from '@mui/material/TextField';
import Divider from '@mui/material/Divider';
import Cookies from 'js-cookie'


export default class CreateDeck extends Component {
	constructor(props) {
		super(props);
        this.changeValue = this.changeValue.bind(this);
		this.state = {
            numPlayers : 4,
            gameInProgress: false,
            curPlayers: [],
            gameState : {},
            bidding: true,
            turn: 0,
            cards: [10,9,8,7,6,5,4,3,2,1,1,2,3,4,5,6,7,8,9,10],
            resetGame : false,
            endPhase : false
		};
	}
    componentDidUpdate(prevProps, prevState){
        // console.log('prevTurn: '+prevState.turn)
        // console.log('stateTurn: ' + this.state.turn)
        // if (prevState.numPlayers !== this.state.numPlayers){
        //     Cookies.set('numPlayers', this.state.numPlayers)
        // } else if (prevState.gameInProgress !== this.state.gameInProgress){
        //     Cookies.set('gameInProgress', this.state.gameInProgress)
        // } else if(prevState.curPlayers !== this.state.curPlayers){
        //     Cookies.set('curPlayers', JSON.stringify(this.state.curPlayers))
        // }else if(prevState.gameState !== this.state.gameState){
        //     Cookies.set('gameState', JSON.stringify(this.state.gameState))
        // }
        // if(prevState.bidding !== this.state.bidding){
        //     Cookies.set('bidding', this.state.bidding)
        // }
        if(prevState.turn !== this.state.turn){
            if (parseInt(this.state.turn) >= 20){
                this.setState({endPhase: true})
            }
        }
        if(prevState.resetGame !== this.state.resetGame){
            if (this.state.resetGame === true)
            Cookies.remove('gameState')
            this.setState({
                numPlayers : 4,
                gameInProgress: false,
                curPlayers: [],
                gameState : {},
                bidding: true,
                turn: 0,
                cards: [10,9,8,7,6,5,4,3,2,1,1,2,3,4,5,6,7,8,9,10],
                resetGame : false,
                endPhase : false
            })

        }
        if (this.state.endPhase === false){
            Cookies.set('gameState', JSON.stringify(this.state))
        }
    }

	componentDidMount() {
        if(window.location.href.slice(-5)==='reset'){
            Cookies.remove('gameState')
            window.location.href=window.location.href.slice(0, -6)
        }
        if (this.state.resetGame){
            this.setState({reset:false})
            Cookies.remove('gameState')
        }else{
            var cookieState = null
            try {
                cookieState = JSON.parse(Cookies.get('gameState'))
            }
            catch{
                cookieState = null
            }
            if (cookieState !== null){
            this.setState({numPlayers : cookieState.numPlayers, gameInProgress: cookieState.gameInProgress, curPlayers:cookieState.curPlayers, gameState:cookieState.gameState, bidding: cookieState.bidding, turn: cookieState.turn})
        }}
    }

    setNumPlayers(numPlayers){
        this.setState({numPlayers : numPlayers})
    }

    renderNames (){
        const nameList = ['Phil', "Janet", 'Alwin', 'Charla', 'Guest 1', 'Guest 2']
        const newThingy = []
        for (let i = 0; i < this.state.numPlayers; i++) {
            newThingy.push(i)
        }
        return(
            newThingy.map((playerThing)=>{
                return(
                    <div key={playerThing}>
                    <TextField size="small" inputProps={{style: {fontSize: '2em'}}} style={{marginLeft: '1em', marginRight:'1em',marginTop:'1em'}} id={playerThing.toString()} label= {"Player "+ (playerThing+1).toString()} variant="outlined" value={nameList[playerThing]}/>
                    </div>
                )
            })
        )
    }

    pressButton(){
        if (this.state.bidding){
            this.checkBids()
        } else{
            this.checkTricks()
        }
    }

    changeValue(e) {
		var prevState = this.state.gameState
        const playerNumber = e.target.id.slice(0,1)
        const playerAttribute = e.target.id.slice(1)
        prevState[playerNumber][playerAttribute]= e.target.value
        this.setState({
			gameState: prevState
		});
	}

    checkBids(){
        var completeBids = 0
        for (let i = 0; i < this.state.numPlayers; i++) {
            if (this.state.gameState[i]['bid']){
            completeBids++}
        }
        if (completeBids === this.state.numPlayers){
            this.setState({bidding:!this.state.bidding})
        }
    }

    checkTricks(){
        var completeTricks = 0
        for (let i = 0; i < this.state.numPlayers; i++) {
            if (this.state.gameState[i]['trick']){
            completeTricks++}
        }
        if (completeTricks === this.state.numPlayers){
            var prevState = this.state.gameState
            for (let i = 0; i < this.state.numPlayers; i++) {
                const trick = parseInt(this.state.gameState[i]['trick'])
                const bid = parseInt(this.state.gameState[i]['bid'])
                var mutator = 0
                var higherValue = trick
                if (bid > trick){
                    higherValue = bid
                }
                if (bid === trick){
                    mutator = 5 + bid
                } else{
                    mutator -= higherValue
                }
                var newScore = prevState[i]['score'] + mutator
                var newState = {'score' : newScore, 'bid' : '', 'trick': ''}
                prevState[i] = newState
            }
            this.setState({bidding:!this.state.bidding, turn:parseInt(this.state.turn)+1, gameState: prevState})
        }
    }

    isDealer(playerNumber){
        var dealerNumber = this.state.turn
        while(dealerNumber > this.state.numPlayers-1){
            dealerNumber -= this.state.numPlayers
        }
        if (dealerNumber === playerNumber){
            return(' (dealer)')
        }
    }

    renderGame(){
        return(
            this.state.curPlayers.map((player)=>{
            var splitDiv = 85/this.state.numPlayers
            var cssString = splitDiv.toString() + "vh"
            var nameDiv = splitDiv*(1/3)
            var nameCss = nameDiv.toString()+"vh"
            return(
                <div key={player.playerNumber} style={{minWidth: '100vw', minHeight: cssString}}>
                    <div style={{minHeight: nameCss, fontSize: '1.75em',   display: 'flex',  justifyContent: 'center',  alignItems: 'center' }}>{player.playerName}{this.isDealer(player.playerNumber)}</div>
                    <div style={{display:'flex', flexDirection:'row'}}>
                        <div style={{minWidth: '33.33vw'}}>
                            <TextField size="small" style={{marginLeft:'1em', marginRight:'1em', marginTop:'0.75em' }} inputProps={{readOnly: true,style: {fontSize: '1.5em'}}} id="outlined-basic1" label="Points" variant='outlined' disabled={true} value={this.state.gameState[player.playerNumber]['score']}/>
                        </div>
                        <div style={{minWidth: '33.33vw'}}>
                            <TextField size="small" value = {this.state.gameState[player.playerNumber]['bid']} inputProps={{style: {fontSize: '1.5em'}}} disabled = {!this.state.bidding} onChange={this.changeValue} style={{marginLeft:'1em', marginRight:'1em', marginTop:'0.75em'}} id={player.playerNumber.toString()+"bid"} type='number' label="Bid" variant="outlined" />
                        </div>
                        <div style={{minWidth: '33.33vw'}}>
                            <TextField size="small" value = {this.state.gameState[player.playerNumber]['trick']} inputProps={{style: {fontSize: '1.5em'}}} disabled = {this.state.bidding} onChange={this.changeValue} style={{marginLeft:'1em', marginRight:'1em', marginTop:'0.75em'}} id={player.playerNumber.toString()+"trick"} type='number' label="Tricks" variant="outlined" />
                        </div>
                    </div>
                    <Divider style={{marginTop:'1vh'}}/>
                </div>
            )
        })
        )
    }

    startGame(){
        const newThingy = []
        var gameState = {}
        for (let i = 0; i < this.state.numPlayers; i++) {
            var playerName = document.getElementById(i).value
            newThingy.push({'playerName' : playerName, 'playerNumber': i})
            var playerObject = {'score' : 0}
            gameState[i] = playerObject
        }
        this.setState({gameState : gameState, curPlayers : newThingy, currentTurn : 0},()=>(this.setState({ gameInProgress: true})))
    }

    printScores(){
        return (this.state.curPlayers.map((player)=>{
            return(
                <div>{player.playerName} got {this.state.gameState[player.playerNumber]['score']} points</div>
            )
        }))
    }

	render() {
        if (this.state.gameInProgress === false){
			return (
				<div style={{textAlign : 'center'}}>
                    <ButtonGroup variant="outlined" aria-label="outlined button group" style={{ marginTop: '2em', marginBottom: '1em'}}>
                        <Button color="primary" style={{fontSize: '1.5em'}} variant={this.state.numPlayers===2?"contained": "outlined"} onClick={()=>this.setNumPlayers(2)}>2</Button>
                        <Button style={{fontSize: '1.5em'}} variant={this.state.numPlayers===3?"contained": "outlined"} onClick={()=>this.setNumPlayers(3)}>3</Button>
                        <Button style={{fontSize: '1.5em'}} variant={this.state.numPlayers===4?"contained": "outlined"} onClick={()=>this.setNumPlayers(4)}>4</Button>
                        <Button style={{fontSize: '1.5em'}} variant={this.state.numPlayers===5?"contained": "outlined"} onClick={()=>this.setNumPlayers(5)}>5</Button>
                        <Button style={{fontSize: '1.5em'}} variant={this.state.numPlayers===6?"contained": "outlined"} onClick={()=>this.setNumPlayers(6)}>6</Button>
                    </ButtonGroup>
                    {this.renderNames()}
                    <Button variant='contained' style={{marginTop: '1em', fontSize:'2em'}} onClick={()=>this.startGame()}>START GAME</Button>
                </div>
			);}
        else if (this.state.endPhase === false){
                return(
                    <>
                    <div className='shadow' style={{backgroundColor: "#013621", minHeight:'10vh', minWidth:'100vw', display:'flex', flexDirection:'row', justifyContent: 'center',  alignItems: 'center'}}>
                        <div style={{fontSize: '1.5em', minWidth:'50vw'}}>Cards: {this.state.cards[this.state.turn]}</div>
                        <Button variant='outlined' onClick={()=>this.pressButton()}>{this.state.bidding?'SET BIDS':'COUNT TRICKS'}</Button>
                    </div>
                    {this.renderGame()}
                    </>
                    )
            }
        else{
            var winner = this.state.curPlayers[0]['playerName']
            var maxPoints = this.state.gameState[0]['score']
                for (let i = 0; i < this.state.numPlayers; i++) {
                    if (this.state.gameState[i]['score']>maxPoints){
                        maxPoints = this.state.gameState[i]['score']
                        winner = this.state.curPlayers[i]['playerName']
                    }
                }
            return(
                <div style={{display: 'flex', flexDirection:'column', justifyContent: 'center',  alignItems: 'center'}}>
                    <div style={{fontSize:'2em', marginTop: '1em'}}>{winner} IS THE WINNER!</div>
                <div style={{fontSize:'1.5em', marginTop: '0.5em', marginBottom:'2em'}}>with {maxPoints} points</div>
                {this.printScores()}
                <Button style={{marginTop:'3em'}} variant='contained'onClick={()=>{this.setState({resetGame:true})}}>
                    Start new game
                </Button>
                </div>
            )
        }
	}
}
