let body = document.querySelector("body");
//Bold Italics Underline JS
let allFontStylingOptions = document.querySelectorAll(".styles i");
let bold = allFontStylingOptions[0];
let italic = allFontStylingOptions[1];
let underline = allFontStylingOptions[2];

bold.addEventListener("click",function(){
    if(lastCell){
        if(lastCell.style.fontWeight != "bold"){
            lastCell.style.fontWeight = "bold";
            let cellAddress = lastCell.getAttribute("data-address");
            dataObj[cellAddress].fontWeight = "bold";
        }
        else{
            lastCell.style.fontWeight = "normal";
            let cellAddress = lastCell.getAttribute("data-address");
            dataObj[cellAddress].fontWeight = "normal";
        }
        
    }
})

italic.addEventListener("click",function(){
    if(lastCell){
        if(lastCell.style.fontStyle != "italic"){
            lastCell.style.fontStyle = "italic";
            let cellAddress = lastCell.getAttribute("data-address");
            dataObj[cellAddress].fontStyle = "italic";
        }
        else{
            lastCell.style.fontStyle = "normal";
            let cellAddress = lastCell.getAttribute("data-address");
            dataObj[cellAddress].fontStyle = "normal";
        }
        
    }
    
})

underline.addEventListener("click",function(){
    if(lastCell){
        if(lastCell.style.textDecoration != "underline"){
            lastCell.style.textDecoration = "underline";
            let cellAddress = lastCell.getAttribute("data-address");
            dataObj[cellAddress].textDecoration = "underline";
        }
        else{
            lastCell.style.textDecoration = "none";
            let cellAddress = lastCell.getAttribute("data-address");
            dataObj[cellAddress].textDecoration = "none";
        }
        
    }
})


//Align JS
let allAlignmentOptions = document.querySelectorAll(".alignment i");

let leftAlign = allAlignmentOptions[0];
let centerAlign = allAlignmentOptions[1];
let rightAlign = allAlignmentOptions[2];

leftAlign.addEventListener("click",function(){
    if(lastCell){
        lastCell.style.textAlign = "left";
        let cellAddress = lastCell.getAttribute("data-address");
        dataObj[cellAddress].align = "left";
    }
})

centerAlign.addEventListener("click",function(){
    if(lastCell){
        lastCell.style.textAlign = "center";
        let cellAddress = lastCell.getAttribute("data-address");
        dataObj[cellAddress].align = "center";
    }
})

rightAlign.addEventListener("click",function(){
    if(lastCell){
        lastCell.style.textAlign = "right";
        let cellAddress = lastCell.getAttribute("data-address");
        dataObj[cellAddress].align = "right";
    }
})


//font family & size
let allFontFSOptions = document.querySelectorAll(".font select");
let fontFamily = allFontFSOptions[0];
let fontSize = allFontFSOptions[1];

fontFamily.addEventListener("change",function(e){
    if(lastCell){
        lastCell.style.fontFamily = e.target.value;
        let cellAddress = lastCell.getAttribute("data-address");
        dataObj[cellAddress].fontFamily = e.target.value;
    }
})

fontSize.addEventListener("change",function(e){
    if(lastCell){
        lastCell.style.fontSize = `${e.target.value}px`;
        let cellAddress = lastCell.getAttribute("data-address");
        dataObj[cellAddress].fontSize = `${e.target.value}px`;
    }
})


//color change
let allColorChange = document.querySelectorAll(".color i");
let bgColor = allColorChange[0];
let textColor = allColorChange[1];

bgColor.addEventListener("click",function(){
    let colorPickerElement = document.createElement("input");
    colorPickerElement.type = "color";
    colorPickerElement.classList.add("colorPicker");
    body.append(colorPickerElement);
    colorPickerElement.click();

    colorPickerElement.addEventListener("input",function(e){
        if(lastCell){
            lastCell.style.backgroundColor = e.currentTarget.value;
            let cellAddress = lastCell.getAttribute("data-address");
            dataObj[cellAddress].bgColor =  e.currentTarget.value;
        }
    })
})

textColor.addEventListener("click",function(){
    let colorPickerElement = document.createElement("input");
    colorPickerElement.type = "color";
    colorPickerElement.classList.add("colorPicker");
    body.append(colorPickerElement);
    colorPickerElement.click();

    colorPickerElement.addEventListener("input",function(e){
        if(lastCell){
            lastCell.style.color = e.currentTarget.value;
            let cellAddress = lastCell.getAttribute("data-address");
            dataObj[cellAddress].color =  e.currentTarget.value;
        }
    })
})


