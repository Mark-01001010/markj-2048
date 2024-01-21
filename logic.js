let board;
let score = 0;
let rows = 4;
let columns = 4;

let is2048Exist = false
let is4096Exist = false
let is8192Exist = false

let startX = 0;
let startY = 0;

// functions are callable program task.
function setGame(){
	board=[
		[0,0,0,0],
		[0,0,0,0],
		[0,0,0,0],
		[0,0,0,0],
	];//back-end board

	for(let r=0; r<rows; r++){
		for (let c=0;c<columns; c++){
			let tile = document.createElement("div");
			tile.id = r.toString() +"-"+c.toString();
			let num = board[r][c];
			updateTile(tile, num);
			document.getElementById("board").append(tile);
		}
	}
	setRandomTile();
	setRandomTile();
}

function updateTile(tile, num){
    tile.innerText = ""; 
    tile.classList.value = "";  
    
    tile.classList.add("tile");

    if(num > 0) {
        tile.innerText = num.toString();
        
        if (num <= 4096){
            tile.classList.add("x"+num.toString());
        } else {
            tile.classList.add("x8192");
        }
    }
}

window.onload = function(){
	setGame();
}

function filterZero(row){
	return row.filter(num=> num != 0);
}

function slide(row){
	row = filterZero(row);
	for(let i=0;i<row.length;i++){
		if(row[i]==row[i+1]){
			row[i]*=2;
			row[i+1]=0;
			score+=row[i];
		}
	}
	row = filterZero(row);

	while(row.length<columns){
		row.push(0);
	}
	return row
}

function handleSlide(e){
	canMove = false;
	if(["ArrowLeft","ArrowRight","ArrowDown","ArrowUp"].includes(e.code)){
		e.preventDefault();
		switch(e.code){
			case 'ArrowLeft':
				slideLeft();
				break;
			case 'ArrowRight':
				slideRight();
				break;
			case 'ArrowUp':
				slideUp();
				break;
			case 'ArrowDown':
				slideDown();
				break;
		}
		document.getElementById("score").innerText = score;
		setTimeout(()=>{
			checkWin();
			if(hasLost()){
				alert("Game Over!");
				restartGame();
				alert("Pess any key to restart");
			}
		},500);
		// setRandomTile();
		canMove ? setRandomTile() : '';
	}
}



let canMove = false;
document.addEventListener("keydown",handleSlide);

function slideLeft(){
	for(let r=0;r<rows;r++){
		let row = board[r];
		//animation
		let originalRow = row.slice();

		row = slide(row);
		board[r] = row;
		for(let c=0;c<columns;c++){
			let tile = document.getElementById(r.toString()+"-"+c.toString())
			let num = board[r][c];
			updateTile(tile,num);

			if(originalRow[c] != num && num != 0){
				tile.style.animation = "slide-from-right 0.3s";
				canMove = true;
				setTimeout(()=>{
					tile.style.animation = "";
				},300);
			}
		}
	}
}

function slideRight(){
	for(let r=0;r<rows;r++){
		let row = board[r];
		let originalRow = row.slice();
		//reverse array before merging left to right
		row.reverse();
		row = slide(row);
		//revert array sequence
		row.reverse();

		board[r] = row;
		for(let c=0;c<columns;c++){
			let tile = document.getElementById(r.toString()+"-"+c.toString())
			let num = board[r][c];
			updateTile(tile,num);

			if(originalRow[c] != num && num != 0){
				tile.style.animation = "slide-from-left 0.3s";
				canMove = true;
				setTimeout(()=>{
					tile.style.animation = "";
				},300);
			}
		}
	}
}

function slideUp(){
	for(let c=0;c<columns;c++){
		let col = [];
		for(let r=0;r<rows;r++){
			col.push(board[r][c]);
		}
		let originalCol = col.slice();
		col = slide(col);

		for(let r=0;r<rows;r++){
			board[r][c] = col[r];
			let tile = document.getElementById(r.toString()+"-"+c.toString())
			let num = board[r][c];
			updateTile(tile,num);

			if(originalCol[r] != num && num != 0){
				tile.style.animation = "slide-from-bottom 0.3s";
				canMove = true;
				setTimeout(()=>{
					tile.style.animation = "";
				},300);
			}
		}
	}
}
function slideDown(){
	for(let c=0;c<columns;c++){
		let col = [];
		for(let r=0;r<rows;r++){
			col.push(board[r][c]);
		}
		//reverse array before merging left to right
		let originalCol = col.slice();
		col.reverse();
		col = slide(col);	
		//revert array sequence
		col.reverse();

		for(let r=0;r<rows;r++){
			board[r][c] = col[r];
			let tile = document.getElementById(r.toString()+"-"+c.toString())
			let num = board[r][c];
			updateTile(tile,num);
			
			if(originalCol[r] != num && num != 0){
				tile.style.animation = "slide-from-top 0.3s";
				canMove = true;
				setTimeout(()=>{
					tile.style.animation = "";
				},300);
			}			
		}
	}
}

function hasEmptyTile(){
	for(let r=0;r<rows;r++){
		for(let c=0;c<columns;c++){
			if(board[r][c]==0){
				return true
			}
		}
	}
	return false;
}

function setRandomTile(){
    
    if(!hasEmptyTile()){
        return;
    }
    let found = false;

    while(!found){        
        let r = Math.floor(Math.random() * rows);
        let c = Math.floor(Math.random() * columns);

        if(board[r][c] == 0){
        	let nn = 2;
            board[r][c] = nn;
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            setTimeout(()=>{
	            tile.innerText = nn.toString();
	            tile.classList.add("x"+nn);
            },300);
            found = true;
        }
    }
}	

function checkWin(){
	for(let r=0;r<rows;r++){
		for(let c=0;c<columns;c++){
			if(board[r][c]==2048 && !is2048Exist){
				alert("You Won! You got the 2048!")
				is2048Exist = true
			}
			else if(board[r][c]==4096 && !is4096Exist){
				alert("You are Unstoppable at 4096!")
				is4096Exist = true
			}
			else if(board[r][c]==8192 && !is8192Exist){
				alert("Victory! You have reached 8192!")
				is8192Exist = true
			}
		}
	}
}

function hasLost() {

    // Check if the board is full (because if the board is full and the player has no possible merges, it means he lose)
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {

        	// If it has an empty tile (value 0), it means the player has not yet lost, so it will return false.
            if (board[r][c] === 0) {
                return false;
            }

            const currentTile = board[r][c];

            // Check if there are adjacent cells (up, down, left, right) for possible merge
            if (
                r > 0 && board[r - 1][c] === currentTile ||
                r < rows - 1 && board[r + 1][c] === currentTile ||
                c > 0 && board[r][c - 1] === currentTile ||
                c < columns - 1 && board[r][c + 1] === currentTile
            ) {
                // Found adjacent cells with the same value, user has not lost
                return false;
            }
        }
    }
    // No possible moves left or empty tiles, user has lost
    return true;
}

function restartGame(){
	for(let r=0;r<rows;r++){
		for(let c=0;c<columns;c++){
			board[r][c]=0;
			// let tile = document.getElementById(r.toString()+"-"+c.toString())
			// let num = board[r][c];
			// updateTile(tile,num);
		}
	}
	score = 0;
	setRandomTile();
}

document.addEventListener('touchstart',(e)=>{
	startX = e.touches[0].clientX;
	startY = e.touches[0].clientY;
})

//check where you touch and prevent scrolling
document.addEventListener('touchsmove',(e)=>{
	if(!e.target.className.includes("tile")){
		return
	}
	e.preventDefault()
},{passive: false});

document.addEventListener('touchend',(e)=>{
    canMove = false;
    // Check if the element that triggered the event has a class name containing "tile"
    if (!e.target.className.includes("tile")) {
        return; // If not, exit the function
    }
    
    // Calculate the horizontal and vertical differences between the initial touch position and the final touch position
    let diffX = startX - e.changedTouches[0].clientX;
    let diffY = startY - e.changedTouches[0].clientY;

    // Check if the horizontal swipe is greater in magnitude than the vertical swipe
    if (Math.abs(diffX) > Math.abs(diffY)) {
        // Horizontal swipe
        if (diffX > 0) {
            slideLeft(); // Call a function for sliding left
            canMove ? setRandomTile() : '';
        } else {
            slideRight(); // Call a function for sliding right
            canMove ? setRandomTile() : '';
        }
    } else {
        // Vertical swipe
        if (diffY > 0) {
            slideUp(); // Call a function for sliding up
            canMove ? setRandomTile() : '';
        } else {
            slideDown();
            canMove ? setRandomTile() : '';
        }
    }

    document.getElementById("score").innerText = score;
        
    checkWin();

    // Call hasLost() to check for game over conditions
    if (hasLost()) {
        // Use setTimeout to delay the alert
        setTimeout(() => {
        alert("Game Over! You have lost the game. Game will restart");
        restartGame();
        alert("Click any key to restart");
        // You may want to reset the game or perform other actions when the user loses.
        }, 100); // Adjust the delay time (in milliseconds) as needed
    }
})
