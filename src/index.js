import React    from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

function Square(props) {
    return (
        <button
            className = "square"
            onClick   = {() => props.onClick()}
        >
            {props.value}
        </button>
    );
}
  
class Board extends React.Component {
    renderSquare(i) {
        return (
            <Square
                value   = {this.props.squares[i]}
                onClick = {() => this.props.onClick(i)}
            />
        );
    }
  
    render() {
        return (
            <div>
            <div className="board-row">
                {this.renderSquare(0)}
                {this.renderSquare(1)}
                {this.renderSquare(2)}
            </div>
            <div className="board-row">
                {this.renderSquare(3)}
                {this.renderSquare(4)}
                {this.renderSquare(5)}
            </div>
            <div className="board-row">
                {this.renderSquare(6)}
                {this.renderSquare(7)}
                {this.renderSquare(8)}
            </div>
            </div>
        );
    }
}

class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            history:   [],
            squares:   Array(9).fill(null),
            timeIndex: 0 
        };
    }

    handleClick(i) {
        if(calculateWinner(this.state.squares) || this.state.squares[i]) return;

        let squares = this.state.squares.slice();
        squares[i]  = this.state.timeIndex % 2 == 0 ? 'X' : 'O';

        const nextTimeIndex = this.state.timeIndex + 1;
        let history         = this.state.history.slice(0, nextTimeIndex);

        history[nextTimeIndex] = squares;

        this.setState({
            history:   history,
            squares:   squares,
            timeIndex: nextTimeIndex
        });
    }

    timeTravel(forward) {
        const newTimeIndex = this.state.timeIndex + (forward ? 1 : -1);
        let squares        = this.state.history[newTimeIndex];

        this.setState({
            squares:   squares,
            timeIndex: newTimeIndex
        });
    }

    render() {
        let status = `Next player: ${this.state.timeIndex % 2 == 0 ? 'X' : 'O'}`;
        if(calculateWinner(this.state.squares)) {
            status = `Winner: ${this.state.timeIndex % 2 == 0 ? 'O' : 'X'}`
        }

        return (
            <div className="game">
                <div className="game-board">
                    <Board
                        squares = {this.state.squares}
                        onClick = {(i) => this.handleClick(i)}
                    />
                </div>
                <div className="game-info">
                    <div>
                        {status}
                    </div>
                    <button
                        disabled = {this.state.timeIndex == 0}
                        onClick  = {() => this.timeTravel(false)}
                    >
                        Backward
                    </button>
                    <button
                        disabled = {this.state.timeIndex >= this.state.history.length - 1}
                        onClick  = {() => this.timeTravel(true)}
                    >
                        Forward
                    </button>
                </div>
            </div>
        );
    }
}
  
// ========================================

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Game />);

function calculateWinner(squares) {
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];
    
    for(let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if(squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return squares[a];
        }
    }
    
    return null;
}