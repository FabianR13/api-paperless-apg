const dataEmployees = [// Catorcenal
// ---------Direction---------
{
  name: 'Ananthakumar',
  lastName: 'Pathmanathan',
  numberEmployee: '10064',
  department: 'Direction',
  position: 'General Manager',
  active: true,
  picture: "10064.jpeg",
  user: false
}, // ---------Human Resources---------
{
  name: 'Veronica',
  lastName: 'Galvan Hurtado',
  numberEmployee: '10022',
  department: 'Human Resources',
  position: 'Human Resources Assistant',
  active: true,
  picture: "10022.jpeg",
  user: false
}, {
  name: 'Kasandra Noheli',
  lastName: 'Trejo',
  numberEmployee: '10077',
  department: 'Human Resources',
  position: 'Human Resources Assistant',
  active: true,
  picture: "10077.jpeg",
  user: false
}, {
  name: 'Juan De Dios',
  lastName: 'Rocha Rodriguez',
  numberEmployee: '10353',
  department: 'Human Resources',
  position: 'Head Of EHS',
  active: true,
  picture: "10353.jpeg",
  user: false
}, {
  name: 'Ana Judith',
  lastName: 'Garcia Zarazua',
  numberEmployee: '10446',
  department: 'Human Resources',
  position: 'Human Resources Assistant',
  active: true,
  picture: "10446.jpeg",
  user: false
}, {
  name: 'Nayeli',
  lastName: 'Lira Vargas',
  numberEmployee: '10447',
  department: 'Human Resources',
  position: 'Nurse',
  active: true,
  picture: "10447.jpeg",
  user: false
}, {
  name: 'Guillermina',
  lastName: 'Chavero Reséndiz',
  numberEmployee: '10679',
  department: 'Human Resources',
  position: 'Payroll Administrator',
  active: true,
  picture: "10679.jpeg",
  user: false
}, {
  name: 'Luis Eduardo',
  lastName: 'Ponce Garcia',
  numberEmployee: '10854',
  department: 'Human Resources',
  position: 'Human Resources Manager',
  active: true,
  picture: "10854.jpeg",
  user: false
}, // ---------Production---------
{
  name: 'Sandy Suley',
  lastName: 'Rodriguez Gomez',
  numberEmployee: '10000',
  department: 'Production',
  position: 'Production and Logistics Manager',
  active: true,
  picture: "10000.jpeg",
  user: false
}, {
  name: 'Fabiola',
  lastName: 'Bertadillo Matehuala',
  numberEmployee: '10035',
  department: 'Production',
  position: 'Leader',
  active: true,
  picture: "10035.jpeg",
  user: false
}, {
  name: 'Laura',
  lastName: 'Arriaga Rojo',
  numberEmployee: '10412',
  department: 'Production',
  position: 'Head Of Operational Training',
  active: true,
  picture: "10412.jpeg",
  user: false
}, {
  name: 'Juan Alberto',
  lastName: 'Armenta Martinez',
  numberEmployee: '10653',
  department: 'Production',
  position: 'Production Supervisor',
  active: true,
  picture: "10653.jpeg",
  user: false
}, {
  name: 'Andrea Paola',
  lastName: 'Ferrer Acosta',
  numberEmployee: '10682',
  department: 'Production',
  position: 'Production Supervisor',
  active: true,
  picture: "10682.jpeg",
  user: false
}, // ---------Logistics---------
{
  name: 'Ismael',
  lastName: 'Paz Resendiz',
  numberEmployee: '10008',
  department: 'Logistics',
  position: 'Export and Transport Analyst',
  active: true,
  picture: "10008.jpeg",
  user: false
}, {
  name: 'Alejandra',
  lastName: 'Camacho Davila',
  numberEmployee: '10217',
  department: 'Logistics',
  position: 'Production Planner',
  active: true,
  picture: "10217.jpeg",
  user: false
}, {
  name: 'Cesar',
  lastName: 'Mendoza Alcauter',
  numberEmployee: '10242',
  department: 'Logistics',
  position: 'Foreign Trade Specialist',
  active: true,
  picture: "10242.jpeg",
  user: false
}, {
  name: 'Michelle Mitsuo',
  lastName: 'Reyes Gutierrez',
  numberEmployee: '10459',
  department: 'Logistics',
  position: 'Material and Packaging Planner',
  active: true,
  picture: "10459.jpeg",
  user: false
}, {
  name: 'Mayra Cristina',
  lastName: 'Luna Gutierrez',
  numberEmployee: '10905',
  department: 'Logistics',
  position: 'Customer Service Jr',
  active: true,
  picture: "10905.jpeg",
  user: false
}, // ---------Process---------
{
  name: 'Guadalupe',
  lastName: 'Teran Torres',
  numberEmployee: '10003',
  department: 'Process',
  position: 'Process Manager',
  active: true,
  picture: "10003.jpeg",
  user: false
}, {
  name: 'Miguel Angel',
  lastName: 'Orduña Gonzalez',
  numberEmployee: '10009',
  department: 'Process',
  position: 'Injection Technician',
  active: true,
  picture: "10009.jpeg",
  user: false
}, {
  name: 'Yovani',
  lastName: 'Camacho Bazaldua',
  numberEmployee: '10280',
  department: 'Process',
  position: 'Junior Technician',
  active: true,
  picture: "10280.jpeg",
  user: false
}, {
  name: 'Ricardo',
  lastName: 'Chavez Rangel',
  numberEmployee: '10349',
  department: 'Process',
  position: 'Plastic Injection Supervisor',
  active: true,
  picture: "10349.jpeg",
  user: false
}, {
  name: 'David Josue',
  lastName: 'Gonzalez Zuñiga',
  numberEmployee: '10363',
  department: 'Process',
  position: 'Plastic Injection Supervisor',
  active: true,
  picture: "10363.jpeg",
  user: false
}, {
  name: 'Randu Francisco',
  lastName: 'Blanquel Mendez',
  numberEmployee: '10424',
  department: 'Process',
  position: 'Injection Technician',
  active: true,
  picture: "10424.jpeg",
  user: false
}, {
  name: 'Victor',
  lastName: 'Ortiz Perez',
  numberEmployee: '10521',
  department: 'Process',
  position: 'Plastic Injection Supervisor',
  active: true,
  picture: "10521.jpeg",
  user: false
}, // ---------IT---------
{
  name: 'Jose Mahonri',
  lastName: 'Del Rincon Alanis',
  numberEmployee: '10078',
  department: 'IT',
  position: 'IT Manager',
  active: true,
  picture: "10078.jpeg",
  user: false
}, {
  name: 'Fabian',
  lastName: 'Ramos Flores',
  numberEmployee: '10329',
  department: 'IT',
  position: 'It Analyst',
  active: true,
  picture: "10329.jpeg",
  user: false
}, // ---------Finance---------
{
  name: 'Leonardo Dario',
  lastName: 'Mateos Perez',
  numberEmployee: '10175',
  department: 'Finance',
  position: 'General Counter',
  active: true,
  picture: "10175.jpeg",
  user: false
}, {
  name: 'Jesus Omar',
  lastName: 'Guerrero Barajas',
  numberEmployee: '10340',
  department: 'Finance',
  position: 'Junior Accountant',
  active: true,
  picture: "10340.jpeg",
  user: false
}, {
  name: 'Alejandro',
  lastName: 'Estrada Montes',
  numberEmployee: '10681',
  department: 'Finance',
  position: 'Junior Accountant',
  active: true,
  picture: "10681.jpeg",
  user: false
}, {
  name: 'Luis Martin',
  lastName: 'Rodriguez Ramirez',
  numberEmployee: '10055',
  department: 'Finance',
  position: 'Buyer',
  active: true,
  picture: "10055.jpeg",
  user: false
}, // ---------Quality---------
{
  name: 'Luis Roman',
  lastName: 'Sahagun Ulloa',
  numberEmployee: '10099',
  department: 'Quality',
  position: 'Laboratory and Metrology Manager',
  active: true,
  picture: "10099.jpeg",
  user: false
}, {
  name: 'Fernando Manuel',
  lastName: 'Ramirez Hernandez',
  numberEmployee: '10142',
  department: 'Quality',
  position: 'Quality Engineer',
  active: true,
  picture: "10142.jpeg",
  user: false
}, {
  name: 'Jaqueline',
  lastName: 'Orduña Vazquez',
  numberEmployee: '10453',
  department: 'Quality',
  position: 'Quality Assistant',
  active: true,
  picture: "10453.jpeg",
  user: false
}, {
  name: 'Margarita Isabel',
  lastName: 'Sierra Rivera',
  numberEmployee: '10707',
  department: 'Quality',
  position: 'Responsible For Quality Management System',
  active: true,
  picture: "10707.jpeg",
  user: false
}, {
  name: 'David Gerardo',
  lastName: 'Muñoz Sanchez',
  numberEmployee: '10798',
  department: 'Quality',
  position: 'Quality Engineer',
  active: true,
  picture: "10798.jpeg",
  user: false
}, {
  name: 'Luis Alberto',
  lastName: 'Aviles Solis',
  numberEmployee: '10843',
  department: 'Quality',
  position: 'Quality Manager',
  active: true,
  picture: "10843.jpeg",
  user: false
}, {
  name: 'Ricardo',
  lastName: 'Ramos Reyes',
  numberEmployee: '10910',
  department: 'Quality',
  position: 'Quality Engineer',
  active: true,
  picture: "10910.jpeg",
  user: false
}, // ---------Automation---------
{
  name: 'Jose Felipe',
  lastName: 'Barrera Lara',
  numberEmployee: '10455',
  department: 'Automation',
  position: 'Robot Specialist',
  active: true,
  picture: "10455.jpeg",
  user: false
}, {
  name: 'Ruydair',
  lastName: 'Solis Resendiz',
  numberEmployee: '10741',
  department: 'Automation',
  position: 'Automation Engineer',
  active: true,
  picture: "10741.jpeg",
  user: false
}, {
  name: 'Jose Gerardo',
  lastName: 'Gomez Hernandez',
  numberEmployee: '10742',
  department: 'Automation',
  position: 'Automation Assistant',
  active: true,
  picture: "10742.jpeg",
  user: false
}, {
  name: 'Sergio',
  lastName: 'Gayosso Cuevas',
  numberEmployee: '10758',
  department: 'Automation',
  position: 'Injection Technician',
  active: true,
  picture: "10758.jpeg",
  user: false
}, {
  name: 'Emmanuel Cristofer',
  lastName: 'Gonzalez Alba',
  numberEmployee: '10783',
  department: 'Automation',
  position: 'Injection Technician',
  active: true,
  picture: "10783.jpeg",
  user: false
}, // ---------Maintenance---------
{
  name: 'Jose Reyes',
  lastName: 'Estrada Rivera',
  numberEmployee: '10098',
  department: 'Maintenance',
  position: 'Maintenance Technician',
  active: true,
  picture: "10098.jpeg",
  user: false
}, {
  name: 'Jose Alejandro',
  lastName: 'Vargas Rojas',
  numberEmployee: '10778',
  department: 'Maintenance',
  position: 'Maintenance Technician',
  active: true,
  picture: "10778.jpeg",
  user: false
}, // ---------Warehouse---------
{
  name: 'Juan Carlos',
  lastName: 'Leon Guerrero',
  numberEmployee: '10287',
  department: 'Warehouse',
  position: 'Shipping Analyst',
  active: true,
  picture: "10287.jpeg",
  user: false
}, {
  name: 'Fernando',
  lastName: 'Carrillo Escamilla',
  numberEmployee: '10458',
  department: 'Warehouse',
  position: 'Warehouse Supervisor',
  active: true,
  picture: "10458.jpeg",
  user: false
}, // ---------ToolRoom---------   
{
  name: 'Jose Alejandro',
  lastName: 'Velasco Resendiz',
  numberEmployee: '10652',
  department: 'ToolRoom',
  position: 'Tool Specialist',
  active: true,
  picture: "10652.jpeg",
  user: false
}, {
  name: 'Ivan Alfonso',
  lastName: 'De La Cruz Gaytan',
  numberEmployee: '10684',
  department: 'ToolRoom',
  position: 'Tool Room Supervisor',
  active: true,
  picture: "10684.jpeg",
  user: false
}, {
  name: 'Diego Arturo',
  lastName: 'Velasco Resendiz',
  numberEmployee: '10768',
  department: 'ToolRoom',
  position: 'Tool Specialist',
  active: true,
  picture: "10768.jpeg",
  user: false
}, // ---------Management---------
{
  name: 'Arturo',
  lastName: 'Mendoza Alcauter',
  numberEmployee: '10500',
  department: 'Management',
  position: 'Internal Customer Coordinator',
  active: true,
  picture: "10500.jpeg",
  user: false
}, // Semanal
// ---------Cleaning---------
{
  name: 'Ma. Rosalba',
  lastName: 'Baeza Hernandez',
  numberEmployee: '10013',
  department: 'Cleaning',
  position: 'Cleaning Leader',
  active: true,
  picture: "10013.jpeg",
  user: false
}, {
  name: 'Ma Guadalupe',
  lastName: 'Orduña Perez',
  numberEmployee: '10372',
  department: 'Cleaning',
  position: 'Cleaning Assistant',
  active: true,
  picture: "10372.jpeg",
  user: false
}, {
  name: 'Reina',
  lastName: 'Mendieta Ramirez',
  numberEmployee: '10381',
  department: 'Cleaning',
  position: 'Cleaning Assistant',
  active: true,
  picture: "10381.jpeg",
  user: false
}, {
  name: 'Martina',
  lastName: 'Prado Mata',
  numberEmployee: '10443',
  department: 'Cleaning',
  position: 'Cleaning Assistant',
  active: true,
  picture: "10443.jpeg",
  user: false
}, {
  name: 'Ma Guadalupe',
  lastName: 'Alvarez Barcenas',
  numberEmployee: '10542',
  department: 'Cleaning',
  position: 'Cleaning Assistant',
  active: true,
  picture: "10542.jpeg",
  user: false
}, // ---------IT---------
{
  name: 'Pedro Azhael',
  lastName: 'Soto Espino',
  numberEmployee: '10796',
  department: 'IT',
  position: 'Intern',
  active: true,
  picture: "10796.jpeg",
  user: false
}, // ---------Finance---------
{
  name: 'Jennifer',
  lastName: 'Olvera Gutierrez',
  numberEmployee: '10861',
  department: 'Finance',
  position: 'Buyer',
  active: true,
  picture: "10861.jpeg",
  user: false
}, // ---------Quality---------
{
  name: 'Jose Luis',
  lastName: 'Juarez Rojas',
  numberEmployee: '10104',
  department: 'Quality',
  position: 'Inspector Leader',
  active: true,
  picture: "10104.jpeg",
  user: false
}, {
  name: 'Diana',
  lastName: 'Gonzalez Zamudio',
  numberEmployee: '10178',
  department: 'Quality',
  position: 'Visual Quality Inspector',
  active: true,
  picture: "10178.jpeg",
  user: false
}, {
  name: 'Maria Soledad',
  lastName: 'Matehuala Reyna',
  numberEmployee: '10216',
  department: 'Quality',
  position: 'Visual Quality Inspector',
  active: true,
  picture: "10216.jpeg",
  user: false
}, {
  name: 'Maria Leticia',
  lastName: 'García Muñiz',
  numberEmployee: '10370',
  department: 'Quality',
  position: 'Visual Quality Inspector',
  active: true,
  picture: "10370.jpeg",
  user: false
}, {
  name: 'Giscela Dolores',
  lastName: 'Ledesma Hernandez',
  numberEmployee: '10393',
  department: 'Quality',
  position: 'Visual Quality Inspector',
  active: true,
  picture: "10393.jpeg",
  user: false
}, {
  name: 'Saul Ivan',
  lastName: 'Perez Perez',
  numberEmployee: '10506',
  department: 'Quality',
  position: 'Visual Quality Inspector',
  active: true,
  picture: "10506.jpeg",
  user: false
}, {
  name: 'Fernando',
  lastName: 'Gonzalez De La Cruz',
  numberEmployee: '10510',
  department: 'Quality',
  position: 'Visual Quality Inspector',
  active: true,
  picture: "10510.jpeg",
  user: false
}, {
  name: 'Cruz Liliana',
  lastName: 'Lopez Estrada',
  numberEmployee: '10528',
  department: 'Quality',
  position: 'Visual Quality Inspector',
  active: true,
  picture: "10528.jpeg",
  user: false
}, {
  name: 'Marina',
  lastName: 'Garcia Roque',
  numberEmployee: '10544',
  department: 'Quality',
  position: 'Visual Quality Inspector',
  active: true,
  picture: "10544.jpeg",
  user: false
}, {
  name: 'Ma Genoveva',
  lastName: 'Ramirez Rangel',
  numberEmployee: '10613',
  department: 'Quality',
  position: 'Visual Quality Inspector',
  active: true,
  picture: "10613.jpeg",
  user: false
}, {
  name: 'Beatriz',
  lastName: 'Nolasco Gonzalez',
  numberEmployee: '10624',
  department: 'Quality',
  position: 'Visual Quality Inspector',
  active: true,
  picture: "10624.jpeg",
  user: false
}, {
  name: 'Maria Noemi',
  lastName: 'Perez Barrera',
  numberEmployee: '10639',
  department: 'Quality',
  position: 'Visual Quality Inspector',
  active: true,
  picture: "10639.jpeg",
  user: false
}, {
  name: 'Sara',
  lastName: 'Zepeda Guerrero',
  numberEmployee: '10688',
  department: 'Quality',
  position: 'Visual Quality Inspector',
  active: true,
  picture: "10688.jpeg",
  user: false
}, {
  name: 'Cristian Erika',
  lastName: 'Flores Pacheco',
  numberEmployee: '10703',
  department: 'Quality',
  position: 'Visual Quality Inspector',
  active: true,
  picture: "10703.jpeg",
  user: false
}, {
  name: 'Karla Itzayana',
  lastName: 'Montoya Perez',
  numberEmployee: '10737',
  department: 'Quality',
  position: 'Visual Quality Inspector',
  active: true,
  picture: "10737.jpeg",
  user: false
}, {
  name: 'Maria Elena',
  lastName: 'Galvan Rodriguez',
  numberEmployee: '10759',
  department: 'Quality',
  position: 'Visual Quality Inspector',
  active: true,
  picture: "10759.jpeg",
  user: false
}, {
  name: 'Alma Yesenia',
  lastName: 'Soto Vargas',
  numberEmployee: '10769',
  department: 'Quality',
  position: 'Visual Quality Inspector',
  active: true,
  picture: "10769.jpeg",
  user: false
}, {
  name: 'Carolina',
  lastName: 'Becerra Ledesma',
  numberEmployee: '10784',
  department: 'Quality',
  position: 'Visual Quality Inspector',
  active: true,
  picture: "10784.jpeg",
  user: false
}, {
  name: 'Juan Daniel',
  lastName: 'Cruz Martinez',
  numberEmployee: '10789',
  department: 'Quality',
  position: 'Visual Quality Inspector',
  active: true,
  picture: "10789.jpeg",
  user: false
}, {
  name: 'Patricia',
  lastName: 'Orduña Silva',
  numberEmployee: '10853',
  department: 'Quality',
  position: 'Visual Quality Inspector',
  active: true,
  picture: "10853.jpeg",
  user: false
}, {
  name: 'Luis Martin',
  lastName: 'Aranda Ruiz',
  numberEmployee: '10883',
  department: 'Quality',
  position: 'Visual Quality Inspector',
  active: true,
  picture: "10883.jpeg",
  user: false
}, {
  name: 'Saul',
  lastName: 'Pimentel',
  numberEmployee: '10884',
  department: 'Quality',
  position: 'Visual Quality Inspector',
  active: true,
  picture: "10884.jpeg",
  user: false
}, {
  name: 'Francisco Kenji',
  lastName: 'Becerril Shimizu',
  numberEmployee: '10885',
  department: 'Quality',
  position: 'Visual Quality Inspector',
  active: true,
  picture: "10885.jpeg",
  user: false
}, {
  name: 'Fabiola',
  lastName: 'Camillo Francisco',
  numberEmployee: '10903',
  department: 'Quality',
  position: 'Visual Quality Inspector',
  active: true,
  picture: "10903.jpeg",
  user: false
}, // ---------Human Resources---------
{
  name: 'Isaias',
  lastName: 'Lara Avendaño',
  numberEmployee: '10292',
  department: 'Human Resources',
  position: 'Ehs Assistant',
  active: true,
  picture: "10292.jpeg",
  user: false
}, {
  name: 'Humberto',
  lastName: 'Hernandez Martinez',
  numberEmployee: '10495',
  department: 'Human Resources',
  position: 'Trainer',
  active: true,
  picture: "10495.jpeg",
  user: false
}, // ---------Warehouse---------
{
  name: 'Juan Manuel',
  lastName: 'Vargas Rodriguez',
  numberEmployee: '10244',
  department: 'Warehouse',
  position: 'Storer',
  active: true,
  picture: "10244.jpeg",
  user: false
}, {
  name: 'Marcelino',
  lastName: 'Baeza Hernandez',
  numberEmployee: '10255',
  department: 'Warehouse',
  position: 'Storer',
  active: true,
  picture: "10255.jpeg",
  user: false
}, {
  name: 'Wilfredo Bulmaro',
  lastName: 'Quevedo Mares',
  numberEmployee: '10473',
  department: 'Warehouse',
  position: 'Storer',
  active: true,
  picture: "10473.jpeg",
  user: false
}, {
  name: 'Maria Araceli',
  lastName: 'Mendoza Gomez',
  numberEmployee: '10546',
  department: 'Warehouse',
  position: 'Receipt Analyst',
  active: true,
  picture: "10546.jpeg",
  user: false
}, {
  name: 'Sergio',
  lastName: 'Hernandez Castellanos',
  numberEmployee: '10566',
  department: 'Warehouse',
  position: 'Storer',
  active: true,
  picture: "10566.jpeg",
  user: false
}, {
  name: 'Karla Itzel',
  lastName: 'Perez Rico',
  numberEmployee: '10594',
  department: 'Warehouse',
  position: 'Warehouse Assistant',
  active: true,
  picture: "10594.jpeg",
  user: false
}, {
  name: 'Darien Itzel',
  lastName: 'Aguilar Gregorio',
  numberEmployee: '10617',
  department: 'Warehouse',
  position: 'Cycle Counter',
  active: true,
  picture: "10617.jpeg",
  user: false
}, {
  name: 'Gerardo Alan',
  lastName: 'Jaime Martinez',
  numberEmployee: '10637',
  department: 'Warehouse',
  position: 'Storer',
  active: true,
  picture: "10637.jpeg",
  user: false
}, {
  name: 'Oscar',
  lastName: 'Cayetano Garcia',
  numberEmployee: '10656',
  department: 'Warehouse',
  position: 'Storer',
  active: true,
  picture: "10656.jpeg",
  user: false
}, {
  name: 'Rene',
  lastName: 'Martinez Martinez',
  numberEmployee: '10693',
  department: 'Warehouse',
  position: 'Storer',
  active: true,
  picture: "10693.jpeg",
  user: false
}, {
  name: 'Juan Pablo',
  lastName: 'Leyva Hernandez',
  numberEmployee: '10697',
  department: 'Warehouse',
  position: 'Storer',
  active: true,
  picture: "10697.jpeg",
  user: false
}, {
  name: 'Jose Luis',
  lastName: 'Nuñez Hernandez',
  numberEmployee: '10767',
  department: 'Warehouse',
  position: 'Storer',
  active: true,
  picture: "10767.jpeg",
  user: false
}, {
  name: 'Eduardo Brayan',
  lastName: 'Ramirez Leon',
  numberEmployee: '10896',
  department: 'Warehouse',
  position: 'Storer',
  active: true,
  picture: "10896.jpeg",
  user: false
}, {
  name: 'Luis Alexis',
  lastName: 'Ramirez Robles',
  numberEmployee: '10902',
  department: 'Warehouse',
  position: 'Storer',
  active: true,
  picture: "10902.jpeg",
  user: false
}, // ---------Automation---------
{
  name: 'Juan Manuel',
  lastName: 'Aguirre Martinez',
  numberEmployee: '10454',
  department: 'Automation',
  position: 'Automation Assistant',
  active: true,
  picture: "10454.jpeg",
  user: false
}, {
  name: 'Griselda',
  lastName: 'Velazquez Lopez',
  numberEmployee: '10605',
  department: 'Automation',
  position: 'Automation Assistant',
  active: true,
  picture: "10605.jpeg",
  user: false
}, // ---------Maintenance---------
{
  name: 'Abel',
  lastName: 'Robles Olvera',
  numberEmployee: '10309',
  department: 'Maintenance',
  position: 'Production Operator',
  active: true,
  picture: "10309.jpeg",
  user: false
}, {
  name: 'Adan',
  lastName: 'Mata Ledesma',
  numberEmployee: '10590',
  department: 'Maintenance',
  position: 'Building Maintenance',
  active: true,
  picture: "10590.jpeg",
  user: false
}, {
  name: 'Juan Leonel',
  lastName: 'Resendiz Robles',
  numberEmployee: '10725',
  department: 'Maintenance',
  position: 'Building Maintenance',
  active: true,
  picture: "10725.jpeg",
  user: false
}, // ---------ToolRoom---------
{
  name: 'Guillermo',
  lastName: 'Prado Mendoza',
  numberEmployee: '10197',
  department: 'ToolRoom',
  position: 'Storer',
  active: true,
  picture: "10197.jpeg",
  user: false
}, {
  name: 'Juan Pablo',
  lastName: 'Hurtado Lopez',
  numberEmployee: '10464',
  department: 'ToolRoom',
  position: 'Tool Helper',
  active: true,
  picture: "10464.jpeg",
  user: false
}, // ---------Process---------
{
  name: 'Juan Angel',
  lastName: 'Contreras Morales',
  numberEmployee: '10236',
  department: 'Process',
  position: 'Junior Technician',
  active: true,
  picture: "10236.jpeg",
  user: false
}, {
  name: 'Mauricio',
  lastName: 'Zarazua Ledesma',
  numberEmployee: '10399',
  department: 'Process',
  position: 'Resiner',
  active: true,
  picture: "10399.jpeg",
  user: false
}, {
  name: 'Rodrigo',
  lastName: 'Camacho Vazquez',
  numberEmployee: '10564',
  department: 'Process',
  position: 'Resiner',
  active: true,
  picture: "10564.jpeg",
  user: false
}, {
  name: 'Rodrigo',
  lastName: 'Romero Quevedo',
  numberEmployee: '10657',
  department: 'Process',
  position: 'Resiner',
  active: true,
  picture: "10657.jpeg",
  user: false
}, {
  name: 'Misael',
  lastName: 'Pantoja Lopez',
  numberEmployee: '10699',
  department: 'Process',
  position: 'Resiner',
  active: true,
  picture: "10699.jpeg",
  user: false
}, {
  name: 'Pedro Alonso',
  lastName: 'Garcia Zarazua',
  numberEmployee: '10817',
  department: 'Process',
  position: 'Resiner',
  active: true,
  picture: "10817.jpeg",
  user: false
}, // ---------Production---------
{
  name: 'Mayra',
  lastName: 'Morales Galvan',
  numberEmployee: '10106',
  department: 'Production',
  position: 'Trainer',
  active: true,
  picture: "10106.jpeg",
  user: false
}, {
  name: 'Yuliana',
  lastName: 'Vega Galvan',
  numberEmployee: '10123',
  department: 'Production',
  position: 'Trainer',
  active: true,
  picture: "10123.jpeg",
  user: false
}, {
  name: 'Fabiola',
  lastName: 'Vega Galvan',
  numberEmployee: '10124',
  department: 'Production',
  position: 'Trainer',
  active: true,
  picture: "10124.jpeg",
  user: false
}, {
  name: 'Monica Magdalena',
  lastName: 'Sosa Olvera',
  numberEmployee: '10230',
  department: 'Production',
  position: 'Production Operator',
  active: true,
  picture: "10230.jpeg",
  user: false
}, {
  name: 'Maria Del Carmen',
  lastName: 'Briones Garcia',
  numberEmployee: '10274',
  department: 'Production',
  position: 'Leader',
  active: true,
  picture: "10274.jpeg",
  user: false
}, {
  name: 'Maria De Los Angeles',
  lastName: 'Briones Garcia',
  numberEmployee: '10282',
  department: 'Production',
  position: 'Production Operator',
  active: true,
  picture: "10282.jpeg",
  user: false
}, {
  name: 'Maria Irene',
  lastName: 'Garcia Hernandez',
  numberEmployee: '10303',
  department: 'Production',
  position: 'Production Operator',
  active: true,
  picture: "10303.jpeg",
  user: false
}, {
  name: 'Julio Leonardo',
  lastName: 'Lugo Campos',
  numberEmployee: '10338',
  department: 'Production',
  position: 'Production Operator',
  active: true,
  picture: "10338.jpeg",
  user: false
}, {
  name: 'Maria Elena',
  lastName: 'Martinez Salazar',
  numberEmployee: '10379',
  department: 'Production',
  position: 'Production Operator',
  active: true,
  picture: "10379.jpeg",
  user: false
}, {
  name: 'Ana Claudia',
  lastName: 'De La Vega Ramirez',
  numberEmployee: '10388',
  department: 'Production',
  position: 'Production Operator',
  active: true,
  picture: "10388.jpeg",
  user: false
}, {
  name: 'Samantha Anahi',
  lastName: 'Baeza Acosta',
  numberEmployee: '10408',
  department: 'Production',
  position: 'Production Operator',
  active: true,
  picture: "10408.jpeg",
  user: false
}, {
  name: 'Maria Fernanda',
  lastName: 'Galvan Rodriguez',
  numberEmployee: '10418',
  department: 'Production',
  position: 'Production Operator',
  active: true,
  picture: "10418.jpeg",
  user: false
}, {
  name: 'Maria Del Rosario',
  lastName: 'Gonzalez Lugo',
  numberEmployee: '10419',
  department: 'Production',
  position: 'Production Operator',
  active: true,
  picture: "10419.jpeg",
  user: false
}, {
  name: 'Adriana',
  lastName: 'Ponce Yañez',
  numberEmployee: '10456',
  department: 'Production',
  position: 'Production Operator',
  active: true,
  picture: "10456.jpeg",
  user: false
}, {
  name: 'Angel Erika',
  lastName: 'Rodriguez',
  numberEmployee: '10461',
  department: 'Production',
  position: 'Production Operator',
  active: true,
  picture: "10461.jpeg",
  user: false
}, {
  name: 'Maria Jacqueline',
  lastName: 'Resendiz Camacho',
  numberEmployee: '10465',
  department: 'Production',
  position: 'Production Operator',
  active: true,
  picture: "10465.jpeg",
  user: false
}, {
  name: 'Andrea',
  lastName: 'Tellez Garcia',
  numberEmployee: '10480',
  department: 'Production',
  position: 'Trainer',
  active: true,
  picture: "10480.jpeg",
  user: false
}, {
  name: 'Maria Dolores',
  lastName: 'Sosa Olvera',
  numberEmployee: '10484',
  department: 'Production',
  position: 'Production Operator',
  active: true,
  picture: "10484.jpeg",
  user: false
}, {
  name: 'Jose Fabian',
  lastName: 'Rodriguez Moya',
  numberEmployee: '10533',
  department: 'Production',
  position: 'Production Operator',
  active: true,
  picture: "10533.jpeg",
  user: false
}, {
  name: 'Omar',
  lastName: 'Gomez Hernandez',
  numberEmployee: '10580',
  department: 'Production',
  position: 'Production Operator',
  active: true,
  picture: "10580.jpeg",
  user: false
}, {
  name: 'Ruben',
  lastName: 'Sanjuan Zarate',
  numberEmployee: '10598',
  department: 'Production',
  position: 'Production Operator',
  active: true,
  picture: "10598.jpeg",
  user: false
}, {
  name: 'Zenaida',
  lastName: 'Segura Perez',
  numberEmployee: '10599',
  department: 'Production',
  position: 'Production Operator',
  active: true,
  picture: "10599.jpeg",
  user: false
}, {
  name: 'Laura Carina',
  lastName: 'Becerra Rivera',
  numberEmployee: '10632',
  department: 'Production',
  position: 'Production Operator',
  active: true,
  picture: "10632.jpeg",
  user: false
}, {
  name: 'Teresa',
  lastName: 'Dominguez Rivera',
  numberEmployee: '10634',
  department: 'Production',
  position: 'Production Operator',
  active: true,
  picture: "10634.jpeg",
  user: false
}, {
  name: 'Ana Vanessa',
  lastName: 'Espinosa Urbina',
  numberEmployee: '10635',
  department: 'Production',
  position: 'Production Operator',
  active: true,
  picture: "10635.jpeg",
  user: false
}, {
  name: 'Bruno',
  lastName: 'Mireles Santana',
  numberEmployee: '10647',
  department: 'Production',
  position: 'Production Operator',
  active: true,
  picture: "10647.jpeg",
  user: false
}, {
  name: 'Miguel',
  lastName: 'Reyna Pardo',
  numberEmployee: '10651',
  department: 'Production',
  position: 'Production Operator',
  active: true,
  picture: "10651.jpeg",
  user: false
}, {
  name: 'Roseyra',
  lastName: 'Pichardo Medina',
  numberEmployee: '10660',
  department: 'Production',
  position: 'Production Operator',
  active: true,
  picture: "10660.jpeg",
  user: false
}, {
  name: 'Maria Daena',
  lastName: 'Rodriguez Prado',
  numberEmployee: '10661',
  department: 'Production',
  position: 'Production Operator',
  active: true,
  picture: "10661.jpeg",
  user: false
}, {
  name: 'Jose Ignacio',
  lastName: 'Vazquez Gutierrez',
  numberEmployee: '10665',
  department: 'Production',
  position: 'Production Operator',
  active: true,
  picture: "10665.jpeg",
  user: false
}, {
  name: 'Samanta Jimena',
  lastName: 'Cortes Cruz',
  numberEmployee: '10666',
  department: 'Production',
  position: 'Production Operator',
  active: true,
  picture: "10666.jpeg",
  user: false
}, {
  name: 'Jose Ivan',
  lastName: 'Perez Gonzalez',
  numberEmployee: '10678',
  department: 'Production',
  position: 'Production Operator',
  active: true,
  picture: "10678.jpeg",
  user: false
}, {
  name: 'Maria Angeles',
  lastName: 'Alamilla Ramirez',
  numberEmployee: '10685',
  department: 'Production',
  position: 'Production Operator',
  active: true,
  picture: "10685.jpeg",
  user: false
}, {
  name: 'Maria Eugenia',
  lastName: 'Becerra Ledesma',
  numberEmployee: '10687',
  department: 'Production',
  position: 'Production Operator',
  active: true,
  picture: "10687.jpeg",
  user: false
}, {
  name: 'Blanca Lucero',
  lastName: 'Rangel Martinez',
  numberEmployee: '10722',
  department: 'Production',
  position: 'Production Operator',
  active: true,
  picture: "10722.jpeg",
  user: false
}, {
  name: 'Lorena',
  lastName: 'Zamudio Rodriguez',
  numberEmployee: '10726',
  department: 'Production',
  position: 'Production Operator',
  active: true,
  picture: "10726.jpeg",
  user: false
}, {
  name: 'Orlando',
  lastName: 'Rivera Soto Domingo',
  numberEmployee: '10729',
  department: 'Production',
  position: 'Production Operator',
  active: true,
  picture: "10729.jpeg",
  user: false
}, {
  name: 'Sergio',
  lastName: 'Ramos Flores',
  numberEmployee: '10757',
  department: 'Production',
  position: 'Production Operator',
  active: true,
  picture: "10757.jpeg",
  user: false
}, {
  name: 'Diana Paola',
  lastName: 'Leyva Olvera',
  numberEmployee: '10762',
  department: 'Production',
  position: 'Production Operator',
  active: true,
  picture: "10762.jpeg",
  user: false
}, {
  name: 'Milagros Maria Dolores',
  lastName: 'Garcia Flores',
  numberEmployee: '10765',
  department: 'Production',
  position: 'Production Operator',
  active: true,
  picture: "10765.jpeg",
  user: false
}, {
  name: 'Marta Susana',
  lastName: 'Arvizu Prado',
  numberEmployee: '10771',
  department: 'Production',
  position: 'Production Operator',
  active: true,
  picture: "10771.jpeg",
  user: false
}, {
  name: 'Sonia',
  lastName: 'Yañez Gonzalez',
  numberEmployee: '10773',
  department: 'Production',
  position: 'Production Operator',
  active: true,
  picture: "10773.jpeg",
  user: false
}, {
  name: 'Cesar Eduardo',
  lastName: 'Vazquez Palacios',
  numberEmployee: '10775',
  department: 'Production',
  position: 'Production Operator',
  active: true,
  picture: "10775.jpeg",
  user: false
}, {
  name: 'Simon Erick',
  lastName: 'Robles Sanchez',
  numberEmployee: '10779',
  department: 'Production',
  position: 'Production Operator',
  active: true,
  picture: "10779.jpeg",
  user: false
}, {
  name: 'Dulce Macarena',
  lastName: 'Chico Duran',
  numberEmployee: '10780',
  department: 'Production',
  position: 'Production Operator',
  active: true,
  picture: "10780.jpeg",
  user: false
}, {
  name: 'Maria Gabriela',
  lastName: 'Sanchez Hernandez',
  numberEmployee: '10788',
  department: 'Production',
  position: 'Production Operator',
  active: true,
  picture: "10788.jpeg",
  user: false
}, {
  name: 'Omar Martin',
  lastName: 'Zarazua Hernandez',
  numberEmployee: '10794',
  department: 'Production',
  position: 'Production Operator',
  active: true,
  picture: "10794.jpeg",
  user: false
}, {
  name: 'Angelica',
  lastName: 'Diaz Ledesma',
  numberEmployee: '10801',
  department: 'Production',
  position: 'Production Operator',
  active: true,
  picture: "10801.jpeg",
  user: false
}, {
  name: 'Maria Fernanda',
  lastName: 'Pegueros Gonzalez',
  numberEmployee: '10803',
  department: 'Production',
  position: 'Production Operator',
  active: true,
  picture: "10803.jpeg",
  user: false
}, {
  name: 'Luis Fernando',
  lastName: 'Del Rincon Alanis',
  numberEmployee: '10805',
  department: 'Production',
  position: 'Production Operator',
  active: true,
  picture: "10805.jpeg",
  user: false
}, {
  name: 'Karla',
  lastName: 'Hernandez Rivera',
  numberEmployee: '10808',
  department: 'Production',
  position: 'Production Operator',
  active: true,
  picture: "10808.jpeg",
  user: false
}, {
  name: 'Bibiana Isabel',
  lastName: 'Sanchez Hurtado',
  numberEmployee: '10811',
  department: 'Production',
  position: 'Production Operator',
  active: true,
  picture: "10811.jpeg",
  user: false
}, {
  name: 'Fatima',
  lastName: 'Gallegos Moreno',
  numberEmployee: '10819',
  department: 'Production',
  position: 'Production Operator',
  active: true,
  picture: "10819.jpeg",
  user: false
}, {
  name: 'Alejandro',
  lastName: 'Mata Chavez',
  numberEmployee: '10822',
  department: 'Production',
  position: 'Production Operator',
  active: true,
  picture: "10822.jpeg",
  user: false
}, {
  name: 'Josefina Guadalupe',
  lastName: 'Rodriguez Barcenas',
  numberEmployee: '10823',
  department: 'Production',
  position: 'Production Operator',
  active: true,
  picture: "10823.jpeg",
  user: false
}, {
  name: 'Hector',
  lastName: 'Medina Frias',
  numberEmployee: '10824',
  department: 'Production',
  position: 'Production Operator',
  active: true,
  picture: "10824.jpeg",
  user: false
}, {
  name: 'Brenda Alejandra',
  lastName: 'Morales Lopez',
  numberEmployee: '10831',
  department: 'Production',
  position: 'Production Operator',
  active: true,
  picture: "10831.jpeg",
  user: false
}, {
  name: 'Ana Cecilia',
  lastName: 'Morin Soto',
  numberEmployee: '10834',
  department: 'Production',
  position: 'Production Operator',
  active: true,
  picture: "10834.jpeg",
  user: false
}, {
  name: 'Liliana',
  lastName: 'Guillen Acosta',
  numberEmployee: '10835',
  department: 'Production',
  position: 'Production Operator',
  active: true,
  picture: "10835.jpeg",
  user: false
}, {
  name: 'Paulo',
  lastName: 'Rojas Jaramillo',
  numberEmployee: '10840',
  department: 'Production',
  position: 'Production Operator',
  active: true,
  picture: "10840.jpeg",
  user: false
}, {
  name: 'Maria Guadalupe',
  lastName: 'Aguilar Arellano',
  numberEmployee: '10841',
  department: 'Production',
  position: 'Production Operator',
  active: true,
  picture: "10841.jpeg",
  user: false
}, {
  name: 'Fatima Nanci',
  lastName: 'Mendez Soto',
  numberEmployee: '10844',
  department: 'Production',
  position: 'Production Operator',
  active: true,
  picture: "10844.jpeg",
  user: false
}, {
  name: 'Jose Alfredo',
  lastName: 'Gonzalez Cardenas',
  numberEmployee: '10846',
  department: 'Production',
  position: 'Production Operator',
  active: true,
  picture: "10846.jpeg",
  user: false
}, {
  name: 'Maria Jesus',
  lastName: 'Estrada Escamilla',
  numberEmployee: '10850',
  department: 'Production',
  position: 'Production Operator',
  active: true,
  picture: "10850.jpeg",
  user: false
}, {
  name: 'Gerardo',
  lastName: 'Rodriguez Guerrero',
  numberEmployee: '10859',
  department: 'Production',
  position: 'Production Operator',
  active: true,
  picture: "10859.jpeg",
  user: false
}, {
  name: 'Maria Brenda',
  lastName: 'Trejo Tovar',
  numberEmployee: '10867',
  department: 'Production',
  position: 'Production Operator',
  active: true,
  picture: "10867.jpeg",
  user: false
}, {
  name: 'David',
  lastName: 'Hernandez Contreras',
  numberEmployee: '10868',
  department: 'Production',
  position: 'Production Operator',
  active: true,
  picture: "10868.jpeg",
  user: false
}, {
  name: 'Silvia',
  lastName: 'Campuzano Rangel',
  numberEmployee: '10869',
  department: 'Production',
  position: 'Production Operator',
  active: true,
  picture: "10869.jpeg",
  user: false
}, {
  name: 'Silvia',
  lastName: 'Lopez Hernandez',
  numberEmployee: '10870',
  department: 'Production',
  position: 'Production Operator',
  active: true,
  picture: "10870.jpeg",
  user: false
}, {
  name: 'Juan Carlos',
  lastName: 'Villanueva Carreon',
  numberEmployee: '10872',
  department: 'Production',
  position: 'Production Operator',
  active: true,
  picture: "10872.jpeg",
  user: false
}, {
  name: 'Anabel',
  lastName: 'Perez Perez',
  numberEmployee: '10873',
  department: 'Production',
  position: 'Production Operator',
  active: true,
  picture: "10873.jpeg",
  user: false
}, {
  name: 'Maria Alma Enedelia',
  lastName: 'Garcia Perez',
  numberEmployee: '10876',
  department: 'Production',
  position: 'Production Operator',
  active: true,
  picture: "10876.jpeg",
  user: false
}, {
  name: 'Gerardo Isaac',
  lastName: 'Rodriguez Sanchez',
  numberEmployee: '10878',
  department: 'Production',
  position: 'Production Operator',
  active: true,
  picture: "10878.jpeg",
  user: false
}, {
  name: 'Gustavo Adolfo',
  lastName: 'Gomez Gomez',
  numberEmployee: '10879',
  department: 'Production',
  position: 'Production Operator',
  active: true,
  picture: "10879.jpeg",
  user: false
}, {
  name: 'Vanesa',
  lastName: 'Ramos Calderon',
  numberEmployee: '10887',
  department: 'Production',
  position: 'Production Operator',
  active: true,
  picture: "10887.jpeg",
  user: false
}, {
  name: 'Jaime',
  lastName: 'Resendiz Nava',
  numberEmployee: '10888',
  department: 'Production',
  position: 'Production Operator',
  active: true,
  picture: "10888.jpeg",
  user: false
}, {
  name: 'Hugo Alvin',
  lastName: 'Butron Torres',
  numberEmployee: '10889',
  department: 'Production',
  position: 'Production Operator',
  active: true,
  picture: "10889.jpeg",
  user: false
}, {
  name: 'Esteban',
  lastName: 'Guerrero de la Vega',
  numberEmployee: '10890',
  department: 'Production',
  position: 'Production Operator',
  active: true,
  picture: "10890.jpeg",
  user: false
}, {
  name: 'Daniel Alejandro',
  lastName: 'Soria Perez',
  numberEmployee: '10891',
  department: 'Production',
  position: 'Production Operator',
  active: true,
  picture: "10891.jpeg",
  user: false
}, {
  name: 'Cinthia Guadalupe',
  lastName: 'Garcia Hernandez',
  numberEmployee: '10897',
  department: 'Production',
  position: 'Production Operator',
  active: true,
  picture: "10897.jpeg",
  user: false
}, {
  name: 'Soledad',
  lastName: 'Canseco Cabrera',
  numberEmployee: '10898',
  department: 'Production',
  position: 'Production Operator',
  active: true,
  picture: "10898.jpeg",
  user: false
}, {
  name: 'America Topacio',
  lastName: 'Colindres Estrada',
  numberEmployee: '10899',
  department: 'Production',
  position: 'Production Operator',
  active: true,
  picture: "10899.jpeg",
  user: false
}, {
  name: 'Laura',
  lastName: 'Gonzalez Prado',
  numberEmployee: '10900',
  department: 'Production',
  position: 'Production Operator',
  active: true,
  picture: "10900.jpeg",
  user: false
}, {
  name: 'Brandon Isaias',
  lastName: 'Velazquez Piña',
  numberEmployee: '10901',
  department: 'Production',
  position: 'Production Operator',
  active: true,
  picture: "10901.jpeg",
  user: false
}, {
  name: 'Diego Manuel',
  lastName: 'Salazar Garcia',
  numberEmployee: '10904',
  department: 'Production',
  position: 'Production Operator',
  active: true,
  picture: "10904.jpeg",
  user: false
}, {
  name: 'Lucero Esmeralda',
  lastName: 'Castro Ocampo',
  numberEmployee: '10906',
  department: 'Production',
  position: 'Production Operator',
  active: true,
  picture: "10906.jpeg",
  user: false
}, {
  name: 'Gerardo',
  lastName: 'Garcia Martinez',
  numberEmployee: '10907',
  department: 'Production',
  position: 'Production Operator',
  active: true,
  picture: "10907.jpeg",
  user: false
}, {
  name: 'Blanca Estela',
  lastName: 'Rayas Rico',
  numberEmployee: '10908',
  department: 'Production',
  position: 'Production Operator',
  active: true,
  picture: "10908.jpeg",
  user: false
}, {
  name: 'Juan Carlos',
  lastName: 'Ramirez Hernandez',
  numberEmployee: '10909',
  department: 'Production',
  position: 'Production Operator',
  active: true,
  picture: "10909.jpeg",
  user: false
}];
module.exports = dataEmployees;