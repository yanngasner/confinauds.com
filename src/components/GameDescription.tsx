import React, {useState} from 'react';
import {useHistory} from 'react-router-dom'
import {customDateConverter} from "../helpers/dateHelpers";
import {GameModel} from "../types/gameTypes";
import {useRecoilValue} from "recoil"
import {userEmailState} from "../types/atoms";
import './GameDescription.css';
import {Team} from "../types/enums";

interface GameDescriptionProps  {
    game : GameModel,
    startGame : () => void,
    endGame : () => void,
    joinBlueGame : () => void,
    joinRedGame : () => void,
    quitGame : () => void,
}

export const GameDescription: React.FC<GameDescriptionProps>
    = ({game, startGame, endGame, joinBlueGame, joinRedGame, quitGame}) => {

    const userEmail = useRecoilValue(userEmailState);

    const isAuthor = () => game.authorEmail === userEmail;
    const isInGame = () => game.players.find(p => p.email === userEmail);
    const isBlue = () => game.players.find(p => p.email === userEmail)?.team === Team.Blue;
    const isRed = () => game.players.find(p => p.email === userEmail)?.team === Team.Red;

    const handleEndClick = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => endGame();

    const handleStartClick = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        startGame();
        history.push(`/${game.id}`);
    }
    const handleJoinBlueClick = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => joinBlueGame();
    const handleJoinRedClick = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => joinRedGame();
    const handleQuitClick = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => quitGame();

    let history = useHistory();

    return (
        <div className='game-description-component'>
            <h2>{game.id}</h2>
            <h2>{game.name}</h2>
            <h3>{`${game.authorEmail} (${customDateConverter(game.creationTime)})`}</h3>
            {isAuthor() && <button onClick={handleStartClick}>Start</button>}
            {isAuthor() && <button onClick={handleEndClick}>End</button>}
            {!isBlue() && <button onClick={handleJoinBlueClick}>JoinBlue</button>}
            {!isRed() && <button onClick={handleJoinRedClick}>JoinRed</button>}
            {isInGame() && !isAuthor() && <button onClick={handleQuitClick}>Quit</button>}
            {isInGame() && <button onClick={handleQuitClick}>Quit</button>}
            <div className='game-description-players'>{game.players.map(p =>
                <div className={p.team === Team.Blue ? 'game-description-player-blue' : 'game-description-player-red'}>
                    <p>{p.email}</p>
                </div>)}
            </div>
        </div>
    )
};

