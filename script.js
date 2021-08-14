//Global variables
let dataObj = {};//contains data in sheet
let lastCell; //to maintain lastcell address which comes useful while de-selecting a cell
//For creating 1-100 row numbers
let rowNumberSection = document.querySelector(".row-number-section");
for(let i=1;i<=100;i++){
    let div = document.createElement("div");
    div.innerText = i;
    div.classList.add("row-number");
    rowNumberSection.append(div);
}

//for creating A-Z column names
let columnTagSection = document.querySelector(".column-tag-section");
for(let i=0;i<26;i++){
    let asciiCode = 65 + i;//65+ 0 =>A
    let reqAlphabet = String.fromCharCode(asciiCode);
    let div = document.createElement("div");
    div.innerText = reqAlphabet;
    div.classList.add("column-tag");
    columnTagSection.append(div);
}

//for scrolling column & row bar
let cellSection = document.querySelector(".cell-section");
cellSection.addEventListener("scroll",function(e){   
    columnTagSection.style.transform = `translateX(-${e.currentTarget.scrollLeft}px)`;  
    rowNumberSection.style.transform = `translateY(-${e.currentTarget.scrollTop}px)`;
})

//grid cells
//nested loop like m*n
//for rows
for(let i=1;i<=100;i++){
    let rowDiv = document.createElement("div");
    rowDiv.classList.add("row");

    //for columns A-Z
    for(let j=0;j<26;j++){
        let asciiCode = 65 + j;
        let reqAlphabet = String.fromCharCode(asciiCode);
        //reqAlphabet + i;//for i=1 => A1..Z1
        let cellAddress = reqAlphabet + i;
        let cellDiv = document.createElement("div");
        cellDiv.contentEditable = true;//so we can write in cell
        //OR cellDiv.setAttribute("contentEditable",true);
        cellDiv.spellcheck = false;//to remove spelling check
        cellDiv.classList.add("cell");
        cellDiv.setAttribute("data-address",cellAddress);
        

        //to update sheet data in object or UI
        dataObj[cellAddress] = {
                value:undefined,
                formula:undefined,
                downstream:[],
                upstream:[],
                align: "left",
                color: "black",
                bgColor: "white",
                fontFamily: "Montserrat",
                fontSize: "15px",
                fontWeight: "normal",//for bold
                fontStyle: "normal",//for italic
                textDecoration: "none",//for underline
        };

        cellDiv.addEventListener("input",function(e){
            //fetching current cell address
            let currCellAddress = e.currentTarget.getAttribute("data-address");
            let currCellObj = dataObj[currCellAddress];
            //updata value of cell in its object
            //if formula is replaced with value
            currCellObj.value = e.currentTarget.innerText;
            currCellObj.formula = undefined; 

            //1- Loop on upstream
            //2- for each cell go to its downstream and remove the slected cell
            //2- empty its own upstream
            let currUpstream = currCellObj.upstream;
            for(let k=0;k<currUpstream.length;k++){
                //currUpstream[k] will give cell address in upstream
                //removeFromDownstream(parent,child)
                removeFromDownstream(currUpstream[k],currCellAddress);
            }
            currCellObj.upstream = [];

            let curDownstream = currCellObj.downstream;
            for(let i=0;i<curDownstream.length;i++){
                updateCell(curDownstream[i]);
            }

            dataObj[currCellAddress] = currCellObj;//to update changes in data object
            console.log(dataObj);
        });


        //to highlight selected cell
        cellDiv.addEventListener("click",function(e){
            if(lastCell){
                lastCell.classList.remove("cell-selected");
            }
            e.currentTarget.classList.add("cell-selected");
            lastCell = e.currentTarget;

            //to change address in formula section 
            let selectedCellAddres = document.querySelector(".selected-cell-div");
            let currCellAddress = e.currentTarget.getAttribute("data-address")
            selectedCellAddres.innerText = currCellAddress;

            //to show formula in formula bar if it exists
            let formulaBar = document.querySelector(".formula-input");
            let currCellFormula = dataObj[currCellAddress].formula;
            if(currCellFormula!=undefined){
                formulaBar.value = currCellFormula;
            }
            else{
                formulaBar.value = "";
            }
        });

        // cellDiv.addEventListener("click",function(e){
        //     let currCell = e.currentTarget;
        //     let currCellObj = dataObj[currCell];
        //     if(currCell.innerText==""){
        //     }
        // })
        rowDiv.append(cellDiv);

    }
    cellSection.append(rowDiv);
}

//to get data from local storge
if(localStorage.getItem("sheet")){
    dataObj =  JSON.parse(localStorage.getItem("sheet"));

    for(let x in dataObj){
        let cell = document.querySelector(`[data-address='${x}']`);
        if(dataObj[x].value){
            cell.innerText = dataObj[x].value;
            cell.style.textAlign = dataObj[x].align;
            cell.style.backgroundColor = dataObj[x].bgColor;
            cell.style.color = dataObj[x].color;
            cell.style.fontFamily = dataObj[x].fontFamily;
            cell.style.fontSize = dataObj[x].fontSize;
            cell.style.fontWeight = dataObj[x].fontWeight;
            cell.style.fontStyle = dataObj[x].fontStyle;
            cell.style.textDecoration = dataObj[x].textDecoration;
        }

    }
}

//formula bar
let formulaInput = document.querySelector(".formula-input");
formulaInput.addEventListener("keydown",function(e){
    if(e.key=="Enter"){
        let typedFormula = e.currentTarget.value;

        if(!lastCell) return;
         
        let selectedCellAddres = lastCell.getAttribute("data-address");
        let cellObj = dataObj[selectedCellAddres];
        cellObj.formula = typedFormula;

        //to remove old values from downstream
        let upstream = cellObj.upstream;
        for(let k=0;k<upstream.length;k++){
            removeFromDownstream(upstream[k],selectedCellAddres);
        }
        cellObj.upstream = [];

        //to update upstream
        let splitFormula = typedFormula.split(" ");
        let cellsInFormula=[];
        for(let i=0;i<splitFormula.length;i++){
            if(splitFormula[i]!="+" && splitFormula[i]!="-" && splitFormula[i]!="*" && splitFormula[i]!="/" && splitFormula[i]!=" "  &&  isNaN(splitFormula[i])){
                cellsInFormula.push(splitFormula[i]);
            }
        }
        cellObj.upstream = cellsInFormula;

        //to update downstream of parent cells(cells containg currentCell in their downstream)
        for(let i=0;i<cellsInFormula.length;i++){
            addToDownstream(cellsInFormula[i],selectedCellAddres);
        }
        

        calculateValueOfCell(cellsInFormula,selectedCellAddres,typedFormula);
 
        let downstream = cellObj.downstream;
        for(let i=0;i<downstream.length;i++){
            updateCell(downstream[i]);
        }
        dataObj[selectedCellAddres] = cellObj;
        console.log(dataObj);

        formulaInput.value = "";//to empty formula bar
    } 
})


// dataObj["A1"].value = 20;
// dataObj["A1"].downstream = ["B1"];
// dataObj["B1"].formula = "2 * A1";
// dataObj["B1"].upstream = ["A1"];
// dataObj["B1"].value = 40;

// let a1Cell = document.querySelector("[data-address='A1']");
// let b1Cell = document.querySelector("[data-address='B1']");

// a1Cell.innerText = 20;
// b1Cell.innerText = 40;
//if formula is being changed to a value or formula is being changed
//C1: Formula(2*A1);
//A1 : parent
//C1: child
//removes child from parent's downstream  
function removeFromDownstream(parentCell,childCell){
    //1- fetch parentCell's downtream
    let parentsDownstream = dataObj[parentCell].downstream;

    //2- filter child from parent's downstream
    let filteredDownstream = [];
    for(let i=0;i<parentsDownstream.length;i++){
        if(parentsDownstream[i]!=childCell){
            filteredDownstream.push(parentsDownstream[i]);
        }
    }

    //save filtered upstream in dataObj
    dataObj[parentCell].downstream = filteredDownstream;
}

//if there is change in the value of cells in the formula
function updateCell(cell){
    let cellObj = dataObj[cell];
    let upstream = cellObj.upstream;
    let formula = cellObj.formula;

    //we are creating this object which will store cells in upstream/formula as keys and and their values will be cell values
    let valObj = {};
    //{
    //    A1:20,
    //    B1:30,
    //}

    //this loop brings values of cells stored in upstream
    for(let i=0;i<upstream.length;i++){
        let cellValue = dataObj[upstream[i]].value;
        valObj[upstream[i]]=cellValue;
    }

    //a1 + b1
    for(let key in valObj){
        formula = formula.replace(key,valObj[key]);
    }
    //"10+20"
    //eval is used to evaluate formula(inputs a string)
    //will return 10+20
    let newValue = eval(formula); 
    dataObj[cell].value = newValue;

    //to update on UI
    let cellOnUi = document.querySelector(`[data-address = '${cell}']`);
    cellOnUi.innerText =  newValue;
    
    //because of this cells contained in the downstream will also have to e updated  
    let downstream = cellObj.downstream;
    //recursion
    for(let i=0;i<downstream.length;i++){//base case
        updateCell(downstream[i]);
    }
}

//to add new cells to parent cells downstream;
function addToDownstream(parent,child){
    dataObj[parent].downstream.push(child); 
} 

//to calculate value of typed formula
function calculateValueOfCell(cellsInFormula,cell,typedformula){
    let valObj = {};
    for(let i=0;i<cellsInFormula.length;i++){
        let cellValue = dataObj[cellsInFormula[i]].value;

        valObj[cellsInFormula[i]] = cellValue;
    }

    for(let key in valObj){
        typedformula = typedformula.replace(key,valObj[key]);
    }
    let newValue = eval(typedformula);

    dataObj[cell].value = newValue;//update in dataobj
    lastCell.innerText = newValue;//update on UI
}

 
//file options
let file = document.querySelector(".fileOptions");
file.addEventListener("click",function(){
    let fileList = document.querySelector(".fileList");
    if(fileList.style.display=="none" || fileList.style.display==""){
        fileList.style.display="flex";
        let fileListOptions = document.querySelectorAll(".fileList div");
        fileListOptions[0].addEventListener("click",function(){
            // fileListOptions[0].style.backgroundColor = "#2ecc71";
            localStorage.setItem("sheet",JSON.stringify(dataObj));
        })
        fileListOptions[1].addEventListener("click",function(){
            //to empty on UI
            for(x in dataObj){
                let cell = document.querySelector(`[data-address='${x}']`);
                cell.innerText = "";
                cell.style.backgroundColor = "white";
                dataObj[x].value = undefined;
                dataObj[x].formula = undefined;
                dataObj[x].downstream = [];
                dataObj[x].upstream = [];
                dataObj[x].align = "left";
                dataObj[x].color = "black";
                dataObj[x].bgColor = "white";
                dataObj[x].fontFamily = "Montserrat";
                dataObj[x].fontSize = "15px";
                dataObj[x].fontWeight = "normal";
                dataObj[x].fontStyle = "normal";
                dataObj[x].textDecoration = "none";
                dataObj[x].fontSize = "15px";
            }
            //to remove from local storage
            localStorage.setItem("sheet","");
        })
    } 
    else{
        fileList.style.display="none";
    }

})


//help option
let help = document.querySelector(".helpOption");
let modal = document.querySelector(".modal");
help.addEventListener("click",function() {
    let modal = document.createElement("div");
    modal.classList.add("modal");
    body.append(modal);
  })

