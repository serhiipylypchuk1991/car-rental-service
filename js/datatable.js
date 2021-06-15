const cars_make_data = new webix.DataCollection({
	url:"./data/car_make.json"
});

const datatable = {
	view:"datatable",
	id:"car_rental_table",
	css:"webix_data_border webix_header_border", //borders for body and headers
	pager:"pager",
	footer:true,
	tooltip:true,
	checkboxRefresh:true, //for using checkbox in cell
	scroll:"xy",
	sort:"multi", //multi sorting
	select:"row",
	resizeColumn:true, //resizing columns in header
	drag:"order", //drag rows
	leftSplit:3, rightSplit:2, //frozen columns
	editable:true,
	editaction:"dblclick",
	headermenu:{
		width:210,
		data:[ //columns for header menu you can hide
			{ id:"car_year", value:"Year" },
			{ id:"color", value:"Color" },
			{ id:"vin_code", value:"VIN" },
			{ id:"phone_number", value:"Phone" },
			{ id:"email", value:"Email" },
			{ id:"snn", value:"SNN" },
			{ id:"iban", value:"IBAN" },
			{ id:"phone_number", value:"Phone" },
			{ id:"city", value:"City" },
			{ id:"credit_card", value:"Card" }
		]
	},
	scheme:{
		$init:function(obj){
			obj.date = webix.i18n.dateFormatDate(obj.date) //change date format
		}
	},
	//columns settings
	columns:[
		{
			id:"stared", header:[{ content:"headerMenu", colspan:2, tooltip:"Show header menu" }], width:35,
			template:function(obj){
				return "<span class='webix_icon star mdi mdi-"+(obj.star ? "star" : "star-outline") + " '></span>";
			},
			footer:{ text:"Available:", colspan:2 }, tooltip:false
		},
		{ id:"rank", header:["",""], editor:"text", width:45, resize:false, tooltip:false },
		{ id:"active", header:[{text:"Available", rotate:true}], editor:"inline-checkbox", sort:"text", width:55, template:customCheckbox, footer:{content:"summColumn", tooltip:"Number of available cars"}, resize:false, tooltip:false  },
		{ id:"company", header:["Company", {content:"selectFilter"}], editor:"combo", sort:"text", width:105, collection:"./data/company.json", tooltip:false  },
		{ id:"car_make", header:[ "Car make", {
			content:"textFilter",	placeholder:"Type car make",
			compare:function(item, value, data){ //custom filtering conditions
				const colValue = cars_make_data.getItem(item).value;
				const toFilter = colValue.toLowerCase();
				value = value.toString().toLowerCase();
				return toFilter.indexOf(value) !== -1;
			}
		}], editor:"combo", sort:"text", width:120, collection:cars_make_data, tooltip:false  },
		{ id:"car_model", header:["Model", {content:"textFilter", placeholder:"Type model"}], editor:"text", sort:"string", width:120, tooltip:false  },
		{ id:"car_year", header:[{text:"Year", content:"excelFilter", mode:"number"}], editor:"text", sort:"int", cssFormat:markOld, width:85, tooltip:false  },
		{ id:"color", header:"Color",	editor:"color", template:"<span style='background-color:#color#; border-radius:4px; padding-right:10px;'>&nbsp</span> #color#", width:100, tooltip:false  },
		{ id:"vin_code", header:"VIN", editor:"text", minWidth:50, width:180, maxWidth:300, tooltip:false  },
		{ id:"manager", header:[{text:"Contacts", colspan:4}, "Manager"], editor:"text", sort:"string", width:150, tooltip:false  },
		{ id:"phone_number", header:["","Phone"], editor:"text", sort:"int", width:120, tooltip:false  },
		{ id:"email", header:["","Email"], editor:"text", width:250, tooltip:false },
		{ id:"snn", header:["","SNN"], editor:"text", width:110, tooltip:false },
		{ id:"date", header:["Date", {content:"datepickerFilter"}], editor:"date", width:150, sort:"date", format:webix.i18n.longDateFormatStr, tooltip:false },
		{ id:"country", header:"Country", editor:"combo", sort:"text", width:140, collection:"./data/country.json", tooltip:false },
		{ id:"city", header:["City", {content:"textFilter", placeholder:"Type city name"}], editor:"text", sort:"string", width:120, tooltip:false },
		{ id:"address", header:"Address", editor:"popup", minWidth:200, fillspace:true, tooltip:false },
		{ id:"price", header:[{text:"Payment information", colspan:3}, "Price"], editor:"text", sort:"int", width:80, format:webix.i18n.priceFormat, tooltip:false },
		{ id:"credit_card", header:["","Card"], editor:"richselect", sort:"text", width:140, collection:"./data/credit_card.json", tooltip:false },
		{ id:"iban", header:["","IBAN"], editor:"text", width:320, tooltip:false },
		{ id:"votes", header:[{text:"Company status", colspan:2}, "Votes"], editor:"text", sort:"int", width:70, cssFormat:markVotes, tooltip:false },
		{ id:"rating", header:["","Rating"], editor:"text", sort:"int", width:70, tooltip:false },
		{ header:[ {text:"<span class='webix_icon wxi-plus-circle' webix_tooltip='Add new element'></span>", colspan:2} ], width:50, template:"<span class='webix_icon wxi-drag' webix_tooltip='Drag this icon to move an element'></span>", tooltip:false },
		{ header:["",""], width:50, template:"{common.trashIcon()}", tooltip:"Delete element" }
	],
	rules:{ //validation rules
		rank:webix.rules.isNumber,
		company:webix.rules.isNotEmpty,
		car_make:webix.rules.isNotEmpty,
		car_model:webix.rules.isNotEmpty,
		car_year:webix.rules.isNumber,
		vin_code:webix.rules.isNotEmpty,
		manager:webix.rules.isNotEmpty,
		phone_number:webix.rules.isNotEmpty,
		email:webix.rules.isEmail,
		snn:webix.rules.isNotEmpty,
		country:webix.rules.isNotEmpty,
		address:webix.rules.isNotEmpty,
		phone_number:webix.rules.isNotEmpty,
		price:function(obj){ return (obj>20 && obj<500) },
		credit_card:webix.rules.isNotEmpty,
		iban:webix.rules.isNotEmpty,
		votes:webix.rules.isNumber,
		rating:webix.rules.isNumber
	},
	url:"./data/data.json",
	onClick:{
		"wxi-plus-circle":() => addNewElement(), //add row
		"wxi-trash":(e, id) => removeElement(id), //delete row
		"wxi-close-circle":(e,id) => deleteColumn(id), //delete column
		"star":(e,id) => selectStar(id)
	},
	on:{
		onBeforeDrag:function(data, e){ 
			return (e.target||e.srcElement).className == "webix_icon wxi-drag";
		}
	}
}

//add new row
function addNewElement(){
	const table = $$("car_rental_table");
	webix.message({ text:"New element was added", expire:350 });
	const id_new_elem = table.add({"active":0, "color":"#1c1919", "date":new Date()});
	table.showItem(id_new_elem); //show new row
}

//remove row
function removeElement(id){
	webix.confirm({
		title:"Element will be deleted",
		text:"Do you still want to continue?",
		type:"confirm-warning"
	}).then(function(){
		webix.message({
			text:"Element was deleted",
			type:"info"
		});
		$$("car_rental_table").remove(id);
	},
	function(){
		webix.message("Rejected");
	});
	return false;
}

//display custom checkbox with "YES" and "NO" values in cells
function customCheckbox(obj, common, value){
	if(value){
		return "<span class='webix_table_checkbox checked'> YES </span>";
	}else{
		return "<span class='webix_table_checkbox notchecked'> NO </span>";
	}
}

//mark cells with value < 2000
function markOld(value){
	if(value < 2000){
		return "highlight";
	}
}

//mark cells with value > 7000
function markVotes(value){
	if(value > 7000){
		return { "text-align":"right", "color":"green" };
	}
}

//add new extra column
function addColumn(){
	const table = $$("car_rental_table");
	table.config.columns.splice(3,0,{
		id:"c"+webix.uid(),
		header:"<span class='webix_icon wxi-close-circle' webix_tooltip='Delete column'></span>Extra column",
		editor:"text",
		width:120
	});
	table.refreshColumns();
}

//delete extra column
function deleteColumn(id){
	const table = $$("car_rental_table");
	table.clearSelection();
	table.editStop();
	table.refreshColumns(table.config.columns.filter(i=>i.id !== id.column));
}

//select star
function selectStar(id){
	const table = $$("car_rental_table");
	const item = table.getItem(id);
	const star = item.star?0:1;
	item.star = star;
}

//reset all data and filters
function resetFilters(){
	const table = $$("car_rental_table");
	table.filter(); //reset filtered data
	table.showItem(table.getFirstId()); //scroll to first element
	table.setState({filter:{}}); //reset all filter fields
}

//export DataTable to Excel
function exportToExcel(){
	webix.toExcel("car_rental_table", {
		filename:"Car Rental Table",
		filterHTML:true,
		styles:true
	});
}
