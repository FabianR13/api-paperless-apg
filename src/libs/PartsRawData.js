const dataParts = [
///TESLA///
{ partnumber: ['1092146-00-D','1092147-00-D'], partName: ['M3S FR LH Closeout Panel ASSY','M3S FR RH Closeout Panel ASSY'], partEcl: 'D', customer: 'Tesla', mould: "TES5D" },
{ partnumber: ['1584746-00-A','1584749-00-A'], partName: ['MS P2 FR Closeout Panel Assy RH','MS P2 FR Closeout Panel Assy LH'], partEcl: 'A', customer: 'Tesla', mould: "TES-44-M01-A" },
{ partnumber: ['1584797-00-A','1584798-00-A'], partName: ['MS P2 RR Closeout Panel Assy LH','MS P2 RR Closeout Panel Assy RH'], partEcl: 'A', customer: 'Tesla', mould: "TES-43-M01-A"},
{ partnumber: ['1619812-00-B'], partName: ['Rear Apron, HEPA, MY'], partEcl: 'B', customer: 'Tesla', mould: "TES 25-M01-A" },
{ partnumber: ['1492603-00-D'], partName: ['Model Y, Colw Screen ASY'], partEcl: 'D', customer: 'Tesla', mould: "Tesla 26-M018" },
{ partnumber: ['1494187-00-C','1494188-00-C'], partName:['Rear Fender Garnish, LH ASY, MY','Rear Fender Garnish, RH ASY, MY'], partEcl: 'C', customer: 'Tesla', mould: "TES25-MO1-A" },
{ partnumber: ['1494185-00-C','1494186-00-C'], partName: ['Front Fender Garnish, LH ASY, MY','Front Fender Garnish, RH ASY, MY'], partEcl: 'C', customer: 'Tesla', mould: "TES24-MO1-A" },
///VW/////
{ partnumber: ['2GJ.853.271B 2MG','2GJ.853.272B 2MG'], partName: ['Bright Fender Patch Assembly LH','Bright Fender Patch Assembly RH'], partEcl: '04S', customer: 'VW', mould: "VW21-M02-A"},
{ partnumber: ['2GJ.853.271 5AP','2GJ.853.272 5AP'], partName: ['Fender Patch Assembly LH','Fender Patch Assembly RH'], partEcl: '04S', customer: 'VW', mould: "VW21-M02-A" },
///TESLA///
{ partnumber: ['1494933-00-B','1494934-00-B'], partName: ['3inX 1R Riser Cover LH','3inX 1R Riser Cover RH'], partEcl: 'B', customer: 'Tesla', mould: "TES 29"},
{ partnumber: ['1624936-00-A','1624937-00-A'], partName: ['3inX 1R Cover Podium LHS INR RH','3inX 1R Cover Podium RHS INR LH'], partEcl: 'A', customer: 'Tesla', mould: "TES 31"},
{ partnumber: ['1494935-00-B','1494938-00-B'], partName: ['3inX 1R Cover Podium LHS INR LH','3inX 1R Cover Podium RHS INR RH'], partEcl: 'B', customer: 'Tesla', mould: "TES 30" },
{ partnumber: ['1470967-00-B'], partName: ['M3 Trunk LD FLR SPPRT Bracket LH'], partEcl: 'B', customer: 'Tesla', mould: "TES14-E" },
///VW///
{ partnumber: ['2GG.821.111','2GG.821.112'], partName: ['Endplate Fender LH','Endplate Fender RH'], partEcl: '04S', customer: 'VW', mould: "VW-M01-A" },
///TESLA///
{ partnumber: ['1494086-00-B'], partName: ['ASY, Access Panel, Model Y'], partEcl: 'B', customer: 'Tesla', mould: "TES-28-M01-A" },
{ partnumber: ['1564256-00-A'], partName: ['MS P2 Frunk Access Panel ASSY'], partEcl: 'A', customer: 'Tesla', mould: "TES 47-M01"},
///BROSE///
{ partnumber: ['E15873','E15874'], partName: ['Rear MFB - CX430 RH','Rear MFB - CX430 LH'], partEcl: '103', customer: 'Brose', mould: "18-391" },
{ partnumber: ['E15871','E15872'], partName: ['Front MFB - CX430 RH','Front MFB - CX430 LH'], partEcl: '104', customer: 'Brose', mould: "TB81944-02-003" },
{ partnumber: ['E59286','E59287'], partName: ['P758 Front Multi-Function Bracket RH','P758 Front Multi-Function Bracket LH'], partEcl: '101', customer: 'Brose', mould: "" },
{ partnumber: ['E59288','E59289'], partName: ['P758 Rear Multi-Function Bracket RH','P758 Rear Multi-Function Bracket LH'], partEcl: '101', customer: 'Brose', mould: "255" },
{ partnumber: ['C47426','C47427'], partName: ['Glass run channel LH','Glass run channel RH'], partEcl: '105', customer: 'Brose', mould: "009-C19003-12" },
{ partnumber: ['C47428','C47429'], partName: ['Glass run channel LH','Glass run channel RH'], partEcl: '105', customer: 'Brose', mould: "009-C19003-12"},
///MARTIN REA////
{ partnumber: ['MX400607'], partName: ['Housing DJ Capless DSL (Assembly)'], partEcl: '1', customer: 'Martinrea', mould: "" },
{ partnumber: ['MX400608'], partName: ['Housing DJ Capless DSL (Assembly)'], partEcl: '2', customer: 'Martinrea', mould: ""},
{ partnumber: ['MX400607-HOU'], partName: ['Housing DJ Capless DSL'], partEcl: '1', customer: 'Martinrea', mould: "MA08-M01-A"},   
{ partnumber: ['MX400608-HOU'], partName: ['Housing DJ Capless DSL'], partEcl: '1', customer: 'Martinrea', mould: "MA08-M01-A"},
{ partnumber: ['MX400607-TAA'], partName: ['DJ Capless - Housing'], partEcl: '1', customer: 'Martinrea', mould: ""},
///APTIV///
{ partnumber: ['35253050','35253069'], partName: ['A-pillar Lower Wire Guide RH','A-pillar Lower Wire Guide LH'], partEcl: 'A', customer: 'Aptiv', mould: "TES10B" },
///VW///
{ partnumber: ['575.819.676'], partName: ['Acoustic Box'], partEcl: '02S', customer: 'VW', mould: "VW18-M01" },
{ partnumber: ['2GJ.825.205.A'], partName: ['CD-Enhancing Underbody Panel - Assy'], partEcl: '01S', customer: 'VW', mould: ""},
{ partnumber: ['5NN.825.215.B'], partName: ['CD-Enhancing all wheel drive - Assy'], partEcl: '03S', customer: 'VW', mould: "VWM28-M01" },
///CIE///
{ partnumber: ['744.846750_00'], partName: ['Front Part Waterchannel ASY'], partEcl: '0', customer: 'CIE', mould: ""},
///STANT///
{ partnumber: ['MIO-7237'], partName: ['LEV3 Shell'], partEcl: '4', customer: 'Stant', mould: "STA5A" },
{ partnumber: ['MIO-7238'], partName: ['LEV3 Cover'], partEcl: '5', customer: 'Stant', mould: "STA2B" },
{ partnumber: ['MIO-7203'], partName: ['ECE Shell'], partEcl: '2', customer: 'Stant', mould: "STA1B" },
{ partnumber: ['MIO-7207'], partName: ['ECE Cover'], partEcl: '3', customer: 'Stant', mould: "Sta2B"},
{ partnumber: ['MIO-6552'], partName: ['SIN NOMBRE'], partEcl: '3', customer: 'Stant', mould: "SINMOLDE" },
///VW///
{ partnumber: ['5NA.980.815.A'], partName: ['Camera fastener'], partEcl: '05S', customer: 'VW', mould: "" },
///STELLANTIS///
{ partnumber: ['57008758AB'], partName: ['DJ Access Cover'], partEcl: '4', customer: 'Stellantis', mould: "" },
///TESLA///
{ partnumber: ['1584795-00-A','1584796-00-A','1584751-00-A'], partName: ['MS P2 RR Grab Handle LH','MS P2 RR Grab Handle RH','MS P2 FR Grab Handle'], partEcl: 'A', customer: 'Tesla', mould: "TES-45-M01-A" },
{ partnumber: ['1470963-00-B'], partName: ['M3 Trunk LD FLR SPPRT Bracket RH'], partEcl: 'B', customer: 'Tesla', mould: "TES14-E"},
///VW///
{ partnumber: ['575.839.613','575.839.614'], partName: ['Guide Rail LH','Guide Rail RH'], partEcl: '02S', customer: 'VW', mould: "VW-17 MO1" },
{ partnumber: ['5Q0.501.733','5Q0.501.734'], partName: ['Underbody Shield LH','Underbody Shield RH'], partEcl: '02S', customer: 'VW', mould: "" },
//Martin rea////
{ partnumber: ['MX400607-TUB'], partName: ['DJ Capless - Urea Tube'], partEcl: '1', customer: 'Martinrea', mould: "MA08-M03-A" },
{ partnumber: ['MX400607-ADP'], partName: ['DJ Capless - Blue Adaptor'], partEcl: '1', customer: 'Martinrea', mould: "MA08-M03-A"},
{ partnumber: ['1133521','1133522'], partName: ['A Pillar Wire Guide LH','A Pillar Wire Guide RH'], partEcl: 'A', customer: 'Aptiv', mould: "TES9A" },
{ partnumber: ['1107204-00-E'], partName: ['Inner Duct HVAC Plenum M3'], partEcl: 'E', customer: 'Tesla', mould: "TES-8D" },
///VW///
{ partnumber: ['5WA.501.715.A'], partName: ['Shielding'], partEcl: '04S', customer: 'VW', mould: "" },
{ partnumber: ['5Q0.501.559 G'], partName: ['Stoneguard LH'], partEcl: '02S', customer: 'VW', mould: "" },
{ partnumber: ['5Q0.501.559 H'], partName: ['Stoneguard LH'], partEcl: '02S', customer: 'VW', mould: "" },
{ partnumber: ['5Q0.501.560 G'], partName: ['Stoneguard RH'], partEcl: '02S', customer: 'VW', mould: "" },
{ partnumber: ['5Q0.501.560 H'], partName: ['Stoneguard RH'], partEcl: '02S', customer: 'VW', mould: "" }, 
];

module.exports = {dataParts};