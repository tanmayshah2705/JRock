var jrockStyle = `
.jrock_jmodalMask
{
width:100%;
height:100%;
top:0;
left:0;
border: 1px solid red;
background: gray;
position:fixed;
opacity: 70%;
}
.jrock_jmodal
{
width:400px;
min-width:400px;
height:300px;
min-height:300px;
background-color:blue;
position:fixed;
top:0;
left:0;
bottom:0;
right:0;
margin:auto;
border:2px solid white;
}
.jrock_jcloseButton
{
float:right;
padding:2px 7px;
cursor:pointer;
margin-right:5px;
margin-top:2px;
font-size:14pt;
}
.jrock_jgrid_header_division
{
overflow-x:hidden;
overflow-y:hidden;
}
.jrock_jgrid_body_division
{
overflow-x:auto;
overflow-y:auto;
}
.jrock_jgrid_head
{
border-bottom:0px;
border-spacing:0px;
border-collapse:collapse;
background:lightgray;
text-align:center;
table-layout:fixed;
}
.jrock_jgrid_body
{
border-spacing:0px;
border-collapse:collapse;
text-align:center;
table-layout:fixed;
}
.jrock_jgrid_head td
{
box-sizing:border-box;
overflow:hidden;
white-space:nowrap;
}
.jrock_jgrid_body td
{
box-sizing:border-box;
overflow:hidden;
white-space:nowrap;
}
.jrock_jgrid_pagination td
{
width:20px;
text-align:center;
}
.jrock_jgrid_pagination_division
{
margin-top:20px;
}
.jrock_jgrid_pagination a
{
background-color:red;
color:white;
padding: 10px 18px;
text-decoration:none;
text-transform:uppercase;
}
`;



function addJRockStyle()
{
var style=document.createElement("style");
style.type="text/css";
style.textContent=jrockStyle;
document.head.appendChild(style);
}

function $$$(cid){
let element=document.getElementById(cid);
if(!element) throw "Invalid id : "+cid;
return new JRockElement(element);
}

$$$.model={
"onStartup":[],
"accordions":[],
"modals":[],
"grids":[]
};



function JRockElement(element)
{
this.element=element;

// html() function
this.html=function(content)
{
if(typeof this.element.innerHTML=="string")
{
if(typeof content=="string")
{
this.element.innerHTML=content;
}
return this.element.innerHTML;
}
return null;
};

// value() function
this.value=function(content)
{
if(typeof this.element.value)
{
if(typeof content=="string")
{
this.element.value=content;
}
return this.element.value;
}
return null;
};

// fillComboBox() function
this.fillComboBox=function(jsonObject)
{
if(this.element.nodeName!="SELECT") throw "fillComboBox can be called on a SELECT type object only";
if(!jsonObject["dataSource"]) throw "\'dataSource\' property is missing in fillComboBox function's parameter";
if(!jsonObject["text"]) throw "\'text\' property is missing in fillComboBox function's parameter";
if(!jsonObject["value"]) throw "\'value\' property is missing in fillComboBox function's parameter";
if(!Array.isArray(jsonObject["dataSource"])) throw "\'dataSource\' property should be a collection in fillComboBox function's parameter";
if(typeof jsonObject["text"]!="string") throw "\'text\' property should be of string type in fillComboBox function's parameter";
if(typeof jsonObject["value"]!="string") throw "\'value\' property should be of string type in fillComboBox function's parameter";
for(let obj of jsonObject["dataSource"]) //to check if values against text and value property is part of dataSource element
{
if(!obj[jsonObject["text"]]) throw "value against \'text\' property is not found in dataSource element";
if(!obj[jsonObject["value"]]) throw "value against \'value\' property is not found in dataSource element";
//alert(obj[jsonObject["text"]] +", "+obj[jsonObject["value"]]);
}
if(jsonObject["firstOption"])
{
if(!jsonObject["firstOption"]["text"]) throw "\'text\' property is missing in firstOption";
if(!jsonObject["firstOption"]["value"]) throw "\'value\' property is missing in firstOption";
if(typeof jsonObject["firstOption"]["text"]!="string") throw "\'text\' property should be of string type in firstOption";
if(typeof jsonObject["firstOption"]["value"]!="string") throw "\'value\' property should be of string type in firstOption";
}
this.element.options.length=0;
if(jsonObject["firstOption"])
{
let option = document.createElement("option");
option.text = jsonObject["firstOption"]["text"];
option.value = jsonObject["firstOption"]["value"];
this.element.appendChild(option);
}
for(let obj of jsonObject["dataSource"])
{
let option = document.createElement("option");
option.text = obj[jsonObject["text"]];
option.value = obj[jsonObject["value"]];
this.element.appendChild(option);
}
};



// setGridData() function
this.setGridData=function(data)
{
if(!Array.isArray(data)) throw "Data supplied to Grid should be an array";
var grid=null;
for(var i=0;i<$$$.model.grids.length;i++)
{
if($$$.model.grids[i].element==this.element)
{
grid=$$$.model.grids[i];    
break;
}
}
if(grid==null) throw "The element is not a Grid";
if(data.length>0)
{
for(let i=0;i<data.length;i++)
{
if(typeof data[i]!="object" || Array.isArray(data[i])) throw "Every item in Grid data should be an object";
if(Object.keys(data[i]).length!=grid.headings.length) throw "Number of properties in every Grid data object should be equal to number of headings";
}
let propertyNames=Object.keys(data[0]);
for(let i=1;i<data.length;i++)
{
let currentPropertyNames=Object.keys(data[i]);
for(var j=0;j<propertyNames.length;j++)
{
if(currentPropertyNames[j]!=propertyNames[j]) throw "All Grid data objects should have the same properties in the same order";
}
}
}
grid.data=data;
grid.pageNumber=1;
grid.update();
if(grid.pagination) grid.updatePagination();
};


//isValid() function
this.isValid=function(obj)
{
//var formId = parameterObject;
var valid = true;
var firstInvalidComponent=null;
var keysArray = Object.keys(obj);
for(var i=0;i<keysArray.length;i++)
{
var key = keysArray[i];
var keyObject = obj[key];
var keyObjectErrors = keyObject.errors;
var keyObjectErrorPane=document.getElementById(keyObject["error-pane"]);
if(keyObjectErrorPane!=null) keyObjectErrorPane.innerHTML="";
var keyObjectElement = document.getElementById(key);
var keyObjectElementCollection=null;
if(keyObjectElement==null){ keyObjectElementCollection=document.getElementsByName(key); if(keyObjectElementCollection.length>0) keyObjectElement=keyObjectElementCollection[0]; }
if(keyObjectElement==null) continue;

if(keyObjectElement.tagName=="INPUT")
{
if(keyObjectElement.type=="text" || keyObjectElement.type=="password" || keyObjectElement.type=="search" || keyObjectElement.type=="tel")
{
if(keyObject.required==true && keyObjectElement.value.trim().length==0)
{
if(keyObjectErrorPane) keyObjectErrorPane.innerHTML=keyObjectErrors.required;
valid=false;
if(firstInvalidComponent==null) firstInvalidComponent=keyObjectElement;
}
else if(keyObject["min-length"]!=null && keyObjectElement.value.trim().length<keyObject["min-length"])
{
if(keyObjectErrorPane) keyObjectErrorPane.innerHTML=keyObjectErrors["min-length"]; 
valid=false;
if(firstInvalidComponent==null) firstInvalidComponent=keyObjectElement;
}
else if(keyObject["max-length"]!=null && keyObjectElement.value.trim().length>keyObject["max-length"])
{
if(keyObjectErrorPane) keyObjectErrorPane.innerHTML=keyObjectErrors["max-length"]; 
valid=false;
if(firstInvalidComponent==null) firstInvalidComponent=keyObjectElement;
}
}
else if(keyObjectElement.type=="email")
{
if(keyObject.required==true && keyObjectElement.value.trim().length==0)
{
if(keyObjectErrorPane) keyObjectErrorPane.innerHTML=keyObjectErrors.required;
valid=false;
if(firstInvalidComponent==null) firstInvalidComponent=keyObjectElement;
}
else if(keyObjectElement.value.trim().length>0)
{
var emailPattern=/^[^\s@]+@[^\s@]+\.[^\s@]+$/;
if(!emailPattern.test(keyObjectElement.value))
{
if(keyObjectErrorPane) keyObjectErrorPane.innerHTML=keyObjectErrors.invalid;
valid=false;
if(firstInvalidComponent==null) firstInvalidComponent=keyObjectElement;
}
else if(keyObject["max-length"]!=null && keyObjectElement.value.length>keyObject["max-length"])
{
if(keyObjectErrorPane) keyObjectErrorPane.innerHTML=keyObjectErrors["max-length"];
valid=false;
if(firstInvalidComponent==null) firstInvalidComponent=keyObjectElement;
}
else if(keyObject["min-length"]!=null && keyObjectElement.value.length<keyObject["min-length"])
{
if(keyObjectErrorPane) keyObjectErrorPane.innerHTML=keyObjectErrors["min-length"];
valid=false;
if(firstInvalidComponent==null) firstInvalidComponent=keyObjectElement;
}
}
}
else if(keyObjectElement.type=="radio")
{
var isChecked=false;
if(keyObjectElementCollection==null) { if(keyObjectElement.checked) isChecked=true; }
else
{
for(let radio of keyObjectElementCollection)
{
if(radio.checked){ isChecked=true; break; }
}
}
if(keyObject.required==true && !isChecked){ 
if(keyObjectErrorPane) keyObjectErrorPane.innerHTML=keyObjectErrors.required;	
valid=false; 
if(firstInvalidComponent==null) firstInvalidComponent=keyObjectElement;  
}
}
else if(keyObjectElement.type=="checkbox")
{
var isChecked=false;
if(keyObjectElementCollection==null) { if(keyObjectElement.checked) isChecked=true; }
else
{
for(let checkbox of keyObjectElementCollection)
{
if(checkbox.checked){ isChecked=true; break; }
}
}
if(keyObject["required-state"]==true && !isChecked)
{ 
if(keyObjectErrorPane) keyObjectErrorPane.innerHTML=keyObjectErrors["required-state"];	
else if(keyObject["display-alert"]) alert(keyObjectErrors["required-state"]);
valid=false; if(firstInvalidComponent==null) firstInvalidComponent=keyObjectElement;  
}				
}
else if(keyObjectElement.type=="number" || keyObjectElement.type=="range")
{
if(keyObject.required==true && keyObjectElement.value.trim().length==0)
{
if(keyObjectErrorPane) keyObjectErrorPane.innerHTML=keyObjectErrors.required;
valid=false;
if(firstInvalidComponent==null) firstInvalidComponent=keyObjectElement;
}
if(keyObjectElement.value.trim().length>0)
{
var numberValue=Number(keyObjectElement.value);
if(isNaN(numberValue))
{
if(keyObjectErrorPane) keyObjectErrorPane.innerHTML=keyObjectErrors.invalid;
valid=false;
if(firstInvalidComponent==null) firstInvalidComponent=keyObjectElement;
}
else
{
if(keyObject["min-value"]!=null && numberValue<Number(keyObject["min-value"]))
{
if(keyObjectErrorPane) keyObjectErrorPane.innerHTML=keyObjectErrors["min-value"];
valid=false;
if(firstInvalidComponent==null) firstInvalidComponent=keyObjectElement;
}
if(keyObject["max-value"]!=null && numberValue>Number(keyObject["max-value"]))
{
if(keyObjectErrorPane) keyObjectErrorPane.innerHTML=keyObjectErrors["max-value"];
valid=false;
if(firstInvalidComponent==null) firstInvalidComponent=keyObjectElement;
}
}
}
}
else if(keyObjectElement.type=="url")
{
if(keyObject.required==true && keyObjectElement.value.trim().length==0)
{
if(keyObjectErrorPane) keyObjectErrorPane.innerHTML=keyObjectErrors.required;
valid=false;
if(firstInvalidComponent==null) firstInvalidComponent=keyObjectElement;
}
else if(keyObjectElement.value.trim().length>0)
{
try{  new URL(keyObjectElement.value);  }
catch(e)
{
if(keyObjectErrorPane) keyObjectErrorPane.innerHTML=keyObjectErrors.invalid;
valid=false;
if(firstInvalidComponent==null) firstInvalidComponent=keyObjectElement;
}
}
}
else if(keyObjectElement.type=="date" || keyObjectElement.type=="datetime-local" || keyObjectElement.type=="month" || keyObjectElement.type=="time" || keyObjectElement.type=="week")
{
if(keyObject.required==true && keyObjectElement.value.trim().length==0)
{
if(keyObjectErrorPane) keyObjectErrorPane.innerHTML=keyObjectErrors.required;
valid=false;
if(firstInvalidComponent==null) firstInvalidComponent=keyObjectElement;
}
if(keyObjectElement.value.trim().length>0)
{
if(keyObject["min-value"]!=null && keyObjectElement.value<keyObject["min-value"])
{
if(keyObjectErrorPane) keyObjectErrorPane.innerHTML=keyObjectErrors["min-value"];
valid=false;
if(firstInvalidComponent==null) firstInvalidComponent=keyObjectElement;
}
if(keyObject["max-value"]!=null && keyObjectElement.value>keyObject["max-value"])
{
if(keyObjectErrorPane) keyObjectErrorPane.innerHTML=keyObjectErrors["max-value"];
valid=false;
if(firstInvalidComponent==null) firstInvalidComponent=keyObjectElement;
}
}
}
else if(keyObjectElement.type=="color")
{
if(keyObject.required==true && keyObjectElement.value.trim().length==0)
{
if(keyObjectErrorPane) keyObjectErrorPane.innerHTML=keyObjectErrors.required;
valid=false;
if(firstInvalidComponent==null) firstInvalidComponent=keyObjectElement;
}
}
else if(keyObjectElement.type=="file")
{
if(keyObject.required==true && keyObjectElement.files.length==0)
{
if(keyObjectErrorPane) keyObjectErrorPane.innerHTML=keyObjectErrors.required;
valid=false;
if(firstInvalidComponent==null) firstInvalidComponent=keyObjectElement;
}
}
else if(keyObjectElement.type=="hidden")
{
if(keyObject.required==true && keyObjectElement.value.trim().length==0)
{
if(keyObjectErrorPane) keyObjectErrorPane.innerHTML=keyObjectErrors.required;
valid=false;
if(firstInvalidComponent==null) firstInvalidComponent=keyObjectElement;
}
}
}
else if(keyObjectElement.tagName=="TEXTAREA")
{
if(keyObject.required==true && keyObjectElement.value.trim().length==0)
{
if(keyObjectErrorPane) keyObjectErrorPane.innerHTML=keyObjectErrors.required;
valid=false;
if(firstInvalidComponent==null) firstInvalidComponent=keyObjectElement;
}
}

else if(keyObjectElement.tagName=="SELECT")
{
if(keyObjectElement.multiple)
{
if(keyObject.required==true && keyObjectElement.selectedOptions.length==0)
{
if(keyObjectErrorPane) keyObjectErrorPane.innerHTML=keyObjectErrors.required;
valid=false;
if(firstInvalidComponent==null) firstInvalidComponent=keyObjectElement;
}
}
else
{
if(keyObject.invalid!=null && keyObjectElement.value==keyObject.invalid)
{
if(keyObjectErrorPane) keyObjectErrorPane.innerHTML=keyObjectErrors.invalid;
valid=false;
if(firstInvalidComponent==null) firstInvalidComponent=keyObjectElement;
}
}
}
}
if(!valid && firstInvalidComponent) firstInvalidComponent.focus();
return valid;
};
}



////////// grid specific code starts here
class Grid
{
constructor(gridElement)
{
var objectAddress=this;
this.element=gridElement;

this.width=0;
this.height=0;
this.headings=[];
this.columnsWidth=[];
this.tableWidth=0;
this.pagination=false;
this.pageSize=0;
this.headingColor=null;
this.cellColor=null;
this.paginationbuttonColor=null;
this.border=null;
this.data=[];
this.pageNumber=1;
this.numberOfPaginationControls=5;
this.headerDivision=null;
this.bodyDivision=null;
this.paginationDivision=null;
this.headerTable=null;
this.dataTable=null;
this.paginationTable=null;

if(!gridElement.hasAttribute("size")) throw "size attribute is required for a Grid";
let size=gridElement.getAttribute("size");
let xpos=size.indexOf("x");
if(xpos==-1) xpos=size.indexOf("X");
if(xpos==-1) throw "In case of Grid, size should be specified as widthxheight";
if(xpos==0 || xpos==size.length-1) throw "In case of Grid, size should be specified as widthxheight";
let width=size.substring(0,xpos);
let height=size.substring(xpos+1);
if(isNaN(width) || isNaN(height)) throw "In case of Grid, width and height should be numbers";
this.width=parseInt(width);
this.height=parseInt(height);
if(this.width<=0 || this.height<=0) throw "In case of Grid, width and height should be greater than zero";

if(!gridElement.hasAttribute("headings")) throw "headings attribute is required for a Grid";
let headingsValue=gridElement.getAttribute("headings");
try{ this.headings=JSON.parse(headingsValue); }
catch(e){ throw "headings attribute should contain a valid array"; }
if(!Array.isArray(this.headings)) throw "headings attribute should contain an array";

if(!gridElement.hasAttribute("columnsWidth")) throw "columnsWidth attribute is required for a Grid";
let columnsWidthValue=gridElement.getAttribute("columnsWidth");
try{ this.columnsWidth=JSON.parse(columnsWidthValue); }
catch(e){ throw "columnsWidth attribute should contain a valid array"; }
if(!Array.isArray(this.columnsWidth)) throw "columnsWidth attribute should contain an array";
if(this.headings.length!=this.columnsWidth.length) throw "Number of headings must be equal to number of column widths";
for(let i=0;i<this.columnsWidth.length;i++)
{
if(isNaN(this.columnsWidth[i])) throw "Every value in columnsWidth should be a number";
this.columnsWidth[i]=parseInt(this.columnsWidth[i]);
if(this.columnsWidth[i]<=0) throw "Every value in columnsWidth should be greater than zero";
this.tableWidth+=this.columnsWidth[i];
}

if(gridElement.hasAttribute("pagination"))
{
let paginationValue=gridElement.getAttribute("pagination");
if(paginationValue.toLowerCase()!="true" && paginationValue.toLowerCase()!="false") throw "pagination attribute should be true or false";
this.pagination=paginationValue.toLowerCase()=="true";

if(this.pagination)
{
if(!gridElement.hasAttribute("pageSize")) throw "pageSize attribute is required when pagination is true";
let pageSizeValue=gridElement.getAttribute("pageSize");
if(isNaN(pageSizeValue)) throw "pageSize attribute should be a number";
this.pageSize=parseInt(pageSizeValue);
if(this.pageSize<=0) throw "pageSize attribute should be greater than zero";
}
if(gridElement.hasAttribute("numberOfPaginationControls"))
{
let numberOfPaginationControlsValue=gridElement.getAttribute("numberOfPaginationControls");
if(isNaN(numberOfPaginationControlsValue)) throw "numberOfPaginationControls should be a valid integer";
this.numberOfPaginationControls=parseInt(numberOfPaginationControlsValue);
if(this.numberOfPaginationControls<=0) throw "numberOfPaginationControls must a positive integer";
}
}

if(gridElement.hasAttribute("border"))
{
let borderValue=gridElement.getAttribute("border");
if(!CSS.supports("border",borderValue)) throw "border attribute should contain a valid CSS border value";
this.border=borderValue;
}

if(gridElement.hasAttribute("headingColor")) this.headingColor=gridElement.getAttribute("headingColor");
if(gridElement.hasAttribute("cellColor")) this.cellColor=gridElement.getAttribute("cellColor"); 
if(gridElement.hasAttribute("paginationbuttonColor")) this.paginationbuttonColor=gridElement.getAttribute("paginationbuttonColor");

this.headerDivision=document.createElement("div");
this.headerDivision.classList.add("jrock_jgrid_header_division");
this.headerDivision.style.width=this.width+"px";
this.element.appendChild(this.headerDivision);
this.bodyDivision=document.createElement("div");
this.bodyDivision.classList.add("jrock_jgrid_body_division");
this.bodyDivision.style.width=this.width+"px";
this.bodyDivision.style.height=this.height+"px";
this.element.appendChild(this.bodyDivision);
if(this.pagination)
{
this.paginationDivision=document.createElement("div");
this.paginationDivision.classList.add("jrock_jgrid_pagination_division");
this.paginationTable=document.createElement("table");
this.paginationTable.classList.add("jrock_jgrid_pagination");
this.paginationDivision.appendChild(this.paginationTable);
this.element.appendChild(this.paginationDivision);
}
this.headerTable=document.createElement("table");
this.headerTable.classList.add("jrock_jgrid_head");
this.headerTable.style.width=this.tableWidth+"px";
this.headerTable.style.minWidth=this.tableWidth+"px";
this.headerDivision.appendChild(this.headerTable);
this.dataTable=document.createElement("table");
this.dataTable.classList.add("jrock_jgrid_body");
this.dataTable.style.width=this.tableWidth+"px";
this.dataTable.style.minWidth=this.tableWidth+"px";
this.bodyDivision.appendChild(this.dataTable);

let tr=document.createElement("tr");
for(let i=0;i<this.headings.length;i++)
{
let td=document.createElement("td");
td.innerHTML=this.headings[i];
td.style.width=this.columnsWidth[i]+"px";
if(this.headingColor) td.style.backgroundColor=this.headingColor;
if(this.border){ td.style.borderLeft=this.border; td.style.borderTop=this.border; td.style.borderRight=this.border; 
}
tr.appendChild(td);
}
this.headerTable.appendChild(tr);

this.bodyDivision.addEventListener("scroll",function(){
objectAddress.headerDivision.scrollLeft=objectAddress.bodyDivision.scrollLeft;
}
);
}

update()
{
while(this.dataTable.rows.length>0) this.dataTable.deleteRow(0);
let startFromIndex=0;
let endAtIndex=this.data.length-1;
if(this.pagination)
{
startFromIndex=(this.pageNumber-1)*this.pageSize;
endAtIndex=startFromIndex+this.pageSize-1;
if(endAtIndex>=this.data.length) endAtIndex=this.data.length-1;
}
for(let i=startFromIndex;i<=endAtIndex;i++)
{
let tr=document.createElement("tr");
let propertyKeys=Object.keys(this.data[i]);
for(let j=0;j<propertyKeys.length;j++)
{
let td=document.createElement("td");
td.innerHTML=this.data[i][propertyKeys[j]];
td.style.width=this.columnsWidth[j]+"px";
if(this.cellColor!=null) td.style.backgroundColor=this.cellColor;
if(this.border!=null) td.style.border=this.border;
tr.appendChild(td);
}
this.dataTable.appendChild(tr);
}

if(this.bodyDivision.scrollHeight >this.bodyDivision.clientHeight) this.headerDivision.style.overflowY="scroll";
else this.headerDivision.style.overflowY="hidden";
}

setPage(pageNumber)
{
this.pageNumber=pageNumber;
this.update();
this.updatePagination();
return false;
}

updatePagination()
{
function createPageChangeFunction(obj,pageNumber)
{
return function(){
obj.setPage(pageNumber);
};
}
let startFrom=(Math.floor((this.pageNumber-1)/this.numberOfPaginationControls))*this.numberOfPaginationControls+1;
let endAt=startFrom+this.numberOfPaginationControls-1;
let numberOfPages=Math.ceil(this.data.length/this.pageSize);
if(numberOfPages==0) return;
if(endAt>numberOfPages) endAt=numberOfPages;
while(this.paginationTable.rows.length>0) this.paginationTable.deleteRow(0);
var x;
var td;
var tr;
var anchor;
tr=document.createElement("tr");
if(startFrom>1)
{
td=document.createElement("td");
anchor=document.createElement("a");
anchor.text="prev";
anchor.href="javascript:void(0)";
anchor.onclick=createPageChangeFunction(this,startFrom-1);
if(this.paginationbuttonColor!=null) anchor.style.backgroundColor=this.paginationbuttonColor;
td.appendChild(anchor);
tr.appendChild(td);
}
for(x=startFrom;x<=endAt;x++)
{
td=document.createElement("td");
if(x==this.pageNumber) td.innerHTML="<b>"+x+"</b>";
else
{
anchor=document.createElement("a");
anchor.text=x;
anchor.href="javascript:void(0)";
anchor.onclick=createPageChangeFunction(this,x);
if(this.paginationbuttonColor!=null) anchor.style.backgroundColor=this.paginationbuttonColor;
td.appendChild(anchor);
}
tr.appendChild(td);
}
if(endAt<numberOfPages)
{
td=document.createElement("td");
anchor=document.createElement("a");
anchor.text="next";
anchor.href="javascript:void(0)";
anchor.onclick=createPageChangeFunction(this,endAt+1);
if(this.paginationbuttonColor!=null) anchor.style.backgroundColor=this.paginationbuttonColor;
td.appendChild(anchor);
tr.appendChild(td);
}
this.paginationTable.appendChild(tr);
}
}


/////////modal specific code starts here
$$$.modals={};

$$$.modals.show=function(mid)
{
let modal=null;
for(var i=0;i<$$$.model.modals.length;i++)
{
if($$$.model.modals[i].getContentId()==mid){ modal=$$$.model.modals[i]; break; }
}
if(modal==null) return;
modal.show();
}

function Modal(cref)
{
var objectAddress=this;
this.beforeOpening=null;
this.afterOpening=null;
this.beforeClosing=null;
this.afterClosing=null;
var contentReference=cref;
this.getContentId=function(){
return contentReference.id;
};
var contentParentReference=contentReference.parentElement;
var contentIndex=0;
while(contentIndex < contentParentReference.children.length)
{
if(contentReference==contentParentReference.children[contentIndex]) break;
++contentIndex;
}
var modalMaskDivision=document.createElement("div");
modalMaskDivision.style.display="none";
modalMaskDivision.classList.add("jrock_jmodalMask");
var modalDivision=document.createElement("div");
modalDivision.style.display="none";
modalDivision.classList.add("jrock_jmodal");
document.body.appendChild(modalMaskDivision);
document.body.appendChild(modalDivision);

var headerDivision=document.createElement("div");
headerDivision.style.background	="red";
headerDivision.style.right="0";
headerDivision.style.height="40px";
headerDivision.style.padding="5px";
modalDivision.appendChild(headerDivision);

if(contentReference.hasAttribute("size"))
{
var sz=contentReference.getAttribute("size");
let xpos=sz.indexOf("x");
if(xpos==-1) xpos=sz.indexOf("X");
if(xpos==-1) throw "In case of modal, size should be specified as widthxheight";
if(xpos==0 || xpos==sz.length-1) throw "In case of modal, size should be specified as widthxheight";
let width=sz.substring(0,xpos);
let height=sz.substring(xpos+1);
modalDivision.style.width=width+"px";
modalDivision.style.height=height+"px";
}
else
{
modalDivision.style.width="300px";
modalDivision.style.height="300px";
}
if(contentReference.hasAttribute("header"))
{
var hd=contentReference.getAttribute("header");
headerDivision.innerHTML=hd;
}

if(contentReference.hasAttribute("maskColor"))
{
var mkc=contentReference.getAttribute("maskColor");
modalMaskDivision.style.background=mkc;
}
if(contentReference.hasAttribute("modalBackgroundColor"))
{
var mbc=contentReference.getAttribute("modalBackgroundColor");
modalDivision.style.background=mbc;
}

var contentDivision=document.createElement("div");									
contentDivision.style.height=(modalDivision.style.height.substring(0,modalDivision.style.height.length-2)-130)+"px";
contentDivision.style.width="98%";
contentDivision.style.overflow="auto";
contentDivision.style.padding="5px";
contentReference.remove();
contentDivision.appendChild(contentReference);
contentReference.style.display="block";
contentReference.style.visibility="visible";
modalDivision.appendChild(contentDivision);

var footerDivision=document.createElement("div");
footerDivision.style.background	="pink";
footerDivision.style.left="0";
footerDivision.style.right="0";
footerDivision.style.height="40px";
footerDivision.style.padding="5px";
footerDivision.style.position="absolute";
footerDivision.style.bottom="0";
modalDivision.appendChild(footerDivision);

if(contentReference.hasAttribute("footer"))
{   
var ft=contentReference.getAttribute("footer");
footerDivision.innerHTML=ft;
}

var closeButtonSpan=null; 
if(contentReference.hasAttribute("closeButton"))
{
var cb=contentReference.getAttribute("closeButton");
if(cb.toLowerCase()=="true")
{
closeButtonSpan=document.createElement("span");
closeButtonSpan.classList.add("jrock_jcloseButton");
var closeButtonMarker=document.createTextNode("x");
closeButtonSpan.appendChild(closeButtonMarker);
headerDivision.appendChild(closeButtonSpan);
}
}

if(contentReference.hasAttribute("beforeOpening"))
{
var bo=contentReference.getAttribute("beforeOpening");
this.beforeOpening=bo;
}
if(contentReference.hasAttribute("afterOpening"))
{
var ao=contentReference.getAttribute("afterOpening");
this.afterOpening=ao;
}
if(contentReference.hasAttribute("beforeClosing"))
{
var bc=contentReference.getAttribute("beforeClosing");
this.beforeClosing=bc;
} 
if(contentReference.hasAttribute("afterClosing"))
{
var ac=contentReference.getAttribute("afterClosing");
this.afterClosing=ac;
} 

this.show=function(){
let openModal=true;
if(this.beforeOpening)
{
openModal=eval(this.beforeOpening);
}
if(openModal)
{
modalDivision.style.display="block";
modalMaskDivision.style.display="block";
if(this.afterOpening) setTimeout(function(){eval(objectAddress.afterOpening);},100);
}
};

if(closeButtonSpan!=null)
{
closeButtonSpan.onclick=function(){
let closeModal=true;
if(objectAddress.beforeClosing)
{
closeModal=eval(objectAddress.beforeClosing);
} 
if(closeModal)
{
modalDivision.style.display="none";
modalMaskDivision.style.display="none";
if(objectAddress.afterClosing) setTimeout(function(){eval(objectAddress.afterClosing);},100);
}
};
}
}



/////////accordion specific code starts here
$$$.accordionHeadingClicked=function(accordionIndex,panelIndex)
{
if($$$.model.accordions[accordionIndex].expandedIndex!=-1) $$$.model.accordions[accordionIndex].panels[$$$.model.accordions[accordionIndex].expandedIndex].style.display = "none";
$$$.model.accordions[accordionIndex].panels[panelIndex+1].style.display=$$$.model.accordions[accordionIndex].panels[panelIndex+1].oldDisplay;
$$$.model.accordions[accordionIndex].expandedIndex=panelIndex+1;
}

$$$.toAccordion=function(accordion)
{
let panels=[];
let expandedIndex=-1;
let children=accordion.childNodes;
let headings=['H1','H2','H3','H4','H5','H6'];
let i;
for(i=0; i<children.length; i++)
{
if(headings.includes(children[i].nodeName)) panels[panels.length]=children[i];
if(children[i].nodeName=="DIV") panels[panels.length]=children[i];
}
if(panels.length%2!=0) throw "Headings and divisions malformed to create accordion because its not even";
for(i=0;i<panels.length;i+=2)
{
if(!headings.includes(panels[i].nodeName)) throw "Headings and divisions malformed to create accordion because its not a 'Heading' at index "+i;
if(panels[i+1].nodeName!="DIV") throw "Headings and divisions malformed to create accordion because its not Div at index"+i;
}
function createClickHandler(accordionIndex,panelIndex)
{
return function(){
$$$.accordionHeadingClicked(accordionIndex,panelIndex);
};
}
let accordionIndex=$$$.model.accordions.length;
for(i=0;i<panels.length;i+=2)
{
panels[i].onclick=createClickHandler(accordionIndex,i);
panels[i+1].oldDisplay=panels[i+1].style.display;
panels[i+1].style.display="none";
}
$$$.model.accordions[accordionIndex]={
"panels":panels,
"expandedIndex":-1
};
}

$$$.onDocumentLoaded=function(func){
if(typeof func!="function") throw "Expected function, found "+(typeof func)+" in call to onDocumentLoaded";
$$$.model.onStartup[$$$.model.onStartup.length]=func;
}









$$$.ajax=function(jsonObject)
{
if(!jsonObject["url"]) throw "url is missing in call to ajax";
let url = jsonObject["url"];
if((typeof url)!="string") throw "url property should be of string type";
let methodType="GET";
if(jsonObject["methodType"])
{
methodType=jsonObject["methodType"];
if((typeof methodType)!="string") throw "methodType property should be of string type in call to ajax";
methodType=methodType.toUpperCase();
if(["GET","POST"].includes(methodType)==false) throw "methodType should be GET/POST in call to ajax"; 
}
let onSuccess=null;
if(jsonObject["success"])
{
onSuccess=jsonObject["success"];
if((typeof onSuccess)!="function") throw "success property should be a function in call to ajax";
}
let onFailure=null;
if(jsonObject["failure"])
{
onFailure=jsonObject["failure"];
if((typeof onFailure)!="function") throw "failure property should be a function in call to ajax";
}

if(methodType=="GET")
{
var xmlHttpRequest = new XMLHttpRequest();
xmlHttpRequest.onreadystatechange=function(){
if(this.readyState==4)
{
if(this.status==200)
{
var responseData = this.responseText;
if(onSuccess) onSuccess(responseData);
}
else
{
if(onFailure) onFailure();
}
}
};
if(jsonObject["data"])
{
let jsonData = jsonObject["data"];
let querystr="";
let qsName;
let qsValue;
let i=0;
for(key in jsonData)
{
if(i==0) querystr="?";
if(i>0) querystr+="&";
i++;
qsName=encodeURI(key);
qsValue=encodeURI(jsonData[key]);
querystr=querystr+qsName+"="+qsValue;
}
url+=querystr; 
}

xmlHttpRequest.open(methodType,url,true);
xmlHttpRequest.send();
}

if(methodType=="POST")
{
var xmlHttpRequest = new XMLHttpRequest();
xmlHttpRequest.onreadystatechange=function(){
if(this.readyState==4)
{
if(this.status==200)
{
var responseData = this.responseText;
if(onSuccess) onSuccess(responseData);
}
else
{
if(onFailure) onFailure();
}
}
};

let jsonData={};
let sendJSON=jsonObject["sendJSON"];
if(!sendJSON) sendJSON=false;
if(typeof sendJSON!="boolean") throw "sendJSON property should be of boolean type in call to ajax";
let querystr="";
if(jsonObject["data"])
{
if(sendJSON)
{
jsonData = jsonObject["data"];
}
else
{
querystr="";
let qsName;
let qsValue;
let i=0;
for(key in data)
{
//if(i==0) querystr="?";
if(i>0) querystr+="&";
i++;
qsName=encodeURI(key);
qsValue=encodeURI(data[key]);
querystr=querystr+qsName+"="+qsValue;
}
}
}
xmlHttpRequest.open(methodType,url,true);

if(sendJSON)
{
xmlHttpRequest.setRequestHeader("Content-type","application/json");
xmlHttpRequest.send(JSON.stringify(jsonData));
}
else
{
xmlHttpRequest.setRequestHeader("Content-type","application/x-www-form-urlencoded");
xmlHttpRequest.send(querystr);
}

}
}




$$$.initFramework=function()
{
addJRockStyle();

//////// setting up forms code starts here
let allForms=document.getElementsByTagName("form");
for(let i=0;i<allForms.length;i++) allForms[i].setAttribute("novalidate","");

//////// setting up accordions code starts here
let allTags=document.getElementsByTagName("*");
let i;
for(i=0;i<allTags.length;i++)
{
if(allTags[i].hasAttribute("accordion"))
{
if(allTags[i].getAttribute("accordion")=="true")
{
$$$.toAccordion(allTags[i]);
}
}
}

//////// setting up modals code starts here
allTags=document.getElementsByTagName("*");
i=0;
while(i<allTags.length)
{
if(allTags[i].hasAttribute("forModal"))
{
if(allTags[i].getAttribute("forModal").toLowerCase()=="true")
{
allTags[i].setAttribute("forModal","false");
$$$.model.modals[$$$.model.modals.length]=new Modal(allTags[i]);
continue;
}
}
++i;
}

//////// setting up grids code starts here
allTags=document.getElementsByTagName("*");
i=0;
while(i<allTags.length)
{
if(allTags[i].hasAttribute("grid"))
{
if(allTags[i].getAttribute("grid").toLowerCase()=="true")
{
allTags[i].setAttribute("grid","false");
$$$.model.grids[$$$.model.grids.length]=new Grid(allTags[i]);
continue;
}
}
++i;
}

for(let x=0;x<$$$.model.onStartup.length;x++)
$$$.model.onStartup[x]();
}


window.addEventListener('load',function(){
$$$.initFramework();
});