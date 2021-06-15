const toolbar = {
	view:"toolbar",
	css:"webix_dark",
	height:50,
	elementsConfig:{
  	css:"webix_primary",
		width:125
  },
	cols:[
		{
			view:"label",
			width:160,
			label:"Car Rental Service",
			align:"center"
		},
		{ view:"button", label:"Reset filters", click:resetFilters },
		{ view:"button", label:"Add column", click:addColumn },
		{ view:"button", label:"Export to Excel", click:exportToExcel }
	]
};
