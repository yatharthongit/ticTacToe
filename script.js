function Gameboard(){
    const row=3;
    const column=3;
    const board=[];

    for(let i=0; i<row ;i++){
        board[i]=[];
        for(let j=0;j<column;j++){
            board[i].push(Cell());
        }
    }

    const getBoard=()=> board;

    const dropToken=(row, column,player)=>{
        if (board[row][column].getValue() !== "") {
            return false;
        }
        board[row][column].addToken(player);
    }

    const printBoard= () =>{
    const boardWithCellValues=board.map((row)=>row.map((cell)=>cell.getValue()));
    console.log(boardWithCellValues);
    }

    const checkwin=()=>{
        const boardValues=board.map((row)=>row.map((cell)=>cell.getValue()));
        for(let i=0;i<3;i++){
            if(
            boardValues[i][0] &&
            boardValues[i][0]===boardValues[i][1] &&
            boardValues[i][1]===boardValues[i][2]){
                return boardValues[i][0];
            }
        }

        for(let i=0;i<3;i++){
           if(
            boardValues[0][i] &&
            boardValues[0][i]===boardValues[1][i] &&
            boardValues[1][i]===boardValues[2][i]){
                return boardValues[0][i];
            } 
        }

        if(
            boardValues[0][0] &&
            boardValues[0][0]=== boardValues[1][1] &&
            boardValues[1][1]===boardValues[2][2]
        ){
            return boardValues[0][0];
        }

        if(
            boardValues[0][2] &&
            boardValues[0][2]=== boardValues[1][1] &&
            boardValues[1][1]===boardValues[2][0]
        ){
            return boardValues[0][2];
        }

        return null;
    }

return{ getBoard, dropToken,printBoard,checkwin};
    
}

function Cell(){
    let value="";

    const addToken=(player)=>{
        value=player;
    }

    const getValue=()=> value;

    return{
        addToken,
        getValue
    }   
}

function gameController(
    playerOneName="Player One",
    playerTwoName="Player Two"
){
    let winner = null;
    const board=Gameboard();

    const player=[{
        name: playerOneName,
        token:"O",
    },
    {
        name: playerTwoName,
        token:"X",
    }];

    let activePlayer=player[0];

    const switchPlayerTurn=()=>{
        activePlayer=activePlayer===player[0]?player[1]:player[0];
    }

    const getActivePlayer=()=> activePlayer;

    const printNewRound=()=>{
        board.printBoard();
        console.log(`${getActivePlayer().name}'s turn.`);
    };

    const playRound=(row,column)=>{
        console.log(`Dropping ${getActivePlayer().name}'s token in ${row} row, ${column} column`);
        if(board.dropToken(row,column,getActivePlayer().token)==false){
            console.log("Invalid move");
            return;
        }

        const winnerToken=board.checkwin();
        if(winnerToken){
        winner=winnerToken;
        console.log(`${getActivePlayer().name} wins!`);
        return;
    }

        switchPlayerTurn();
        printNewRound();
    }

     const getWinner = () => winner;


    printNewRound();

    return {
    playRound,
    getActivePlayer,
    getWinner,
    getBoard: board.getBoard
  }
}

function screenController(){
    const game = gameController();
    const playerTurnDiv = document.querySelector('.turn');
    const boardDiv = document.querySelector('.board');

    const updateScreen=()=>{
        boardDiv.textContent="";

        const board=game.getBoard();
        const win=game.getWinner();
        const activePlayer=game.getActivePlayer();

        if(win){
            playerTurnDiv.textContent=`${activePlayer.name} wins!`;
        }
        else{
            playerTurnDiv.textContent=`${activePlayer.name}'s Turn`;
        }

        board.forEach((row,indexRow)=>{
            row.forEach((cell,indexColumn)=>{
                const cellButton=document.createElement("button");
                cellButton.classList.add("cell");

                cellButton.dataset.cell=indexColumn;
                cellButton.dataset.row=indexRow;
                cellButton.textContent=cell.getValue();
                boardDiv.appendChild(cellButton);
            })
        })

    }

    function click(e){
        const selectedColumn=e.target.dataset.cell;
        const selectedRow=e.target.dataset.row;
        if(!selectedColumn || !selectedRow) return;
        if(game.getWinner()) return;
        game.playRound(selectedRow,selectedColumn);
        updateScreen();
    }
    
    boardDiv.addEventListener("click",click);
    updateScreen();
    
}

screenController();