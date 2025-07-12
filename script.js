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
        board[row][column].addToken(player);
    }

    const printBoard= () =>{
    const boardWithCellValues=board.map((row)=>row.map((cell)=>cell.getValue()));
    console.log(boardWithCellValues);
}

return{ getBoard, dropToken,printBoard};
    
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
    const board=Gameboard();

    const player=[{
        name: playerOneName,
        token:"O"
    },
    {
        name: playerTwoName,
        token:"X"
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
        board.dropToken(row,column,getActivePlayer().token);

        switchPlayerTurn();
        printNewRound();
    }

    printNewRound();

    return {
    playRound,
    getActivePlayer,
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
        const activePlayer=game.getActivePlayer();

        playerTurnDiv.textContent=`${activePlayer}'s Turn`;

        board.forEach((row,indexRow)=>{
            row.forEach((cell,indexColumn)=>{
                const cellButton=document.createElement("button");
                cellButton.classList.add("cell");

                cellButton.dataset.column=indexColumn;
                cellButton.dataset.row=indexRow;
                cellButton.textContent=cell.getValue();
                boardDiv.appendChild(cellButton);
            })
        })

    }

    function click(e){
        const selectedColumn=e.target.dataset.column;
        const selectedRow=e.target.dataset.row;
        if(!selectedColumn || !selectedRow) return;
        game.playRound(selectedRow,selectedColumn);
        updateScreen();
    }
    
    boardDiv.addEventListener("click",click);
    updateScreen();
    
}

screenController();