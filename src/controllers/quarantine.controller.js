const Company = require("../models/Company");
const User = require("../models/User");
const Quarantine = require("../models/Quarantine");
const Items = require("../models/Items.js");
const Employees = require("../models/Employees");


const createQUARequest = async (req, res) => {
    const { CompanyId } = req.params;
    const user = await User.findById(req.userId)

    if (!user) return res.status(404).json({ status: "error", message: "Error al buscar usuario" });

    const foundCompany = await Company.findById(CompanyId);
    if (!foundCompany) return res.status(404).json({ status: "error", message: "Company not found" });

    const dateMX = new Date(new Date().toLocaleString("en-US", { timeZone: "America/Mexico_City" }));

    const year = dateMX.getFullYear();
    const month = String(dateMX.getMonth() + 1).padStart(2, '0');
    const day = String(dateMX.getDate()).padStart(2, '0');
    const newDate = `${year}-${month}-${day}`; // Fecha actual para el ID

    const hourMX = dateMX.getHours();
 const minutesMX = dateMX.getMinutes();
    const time = `${String(hourMX).padStart(2, '0')}:${String(minutesMX).padStart(2, '0')}`;
   
    let turno;

    if (hourMX >= 7 && hourMX < 15) { // D: 7:00 a 12:59 hrs
        turno = 'D';
    } else if (hourMX >= 15 && hourMX < 23) {// A: 13:00 a 22:59 hrs
        turno = 'A';
    } else { // N: 23:00 a 06:59 hrs
        turno = 'N';
    }

    const idMovePrefix = `QUA-${newDate}-${turno}`;

    // Buscar el último pedido creado
    const lastMove = await Quarantine.findOne().sort({ createdAt: -1 });

    let consecutivo = 1;

    if (lastMove && lastMove.moveID) {
        const lastId = lastMove.moveID;

        // (?:-\d+)? permite ignorar el "-1" si existe, capturando el número base en el grupo 2.
        // Ejemplo: Si lastId es "QUA-...-N001-1", captura "N" y "001".
        const idMatch = lastId.match(/QUA-\d{4}-\d{2}-\d{2}-([DAN])(\d+)(?:-\d+)?$/);

        if (idMatch && idMatch.length >= 3) {
            const lastTurno = idMatch[1]; // La letra del turno anterior (ej: 'N')
            const lastNumber = parseInt(idMatch[2], 10); // El número base (ej: 1)

            if (lastTurno === turno) {
                // Si seguimos en el mismo turno, sumamos.
                consecutivo = lastNumber + 1;
            }
            // Si el turno es diferente, consecutivo se queda en 1 (reinicio).
        }
    }

    const paddedConsecutivo = String(consecutivo).padStart(3, '0');
    let idMove = `${idMovePrefix}${paddedConsecutivo}`; // Usamos 'let' para modificarlo si es necesario

    // --- VALIDACIÓN DE DUPLICADOS (SOLO TURNO N) ---
    if (turno === 'N') {
        // Verificamos si este ID base ya existe (conflicto madrugada vs noche)
        const existe = await Quarantine.findOne({ moveID: idMove });

        if (existe) {
            // Si existe, simplemente agregamos "-1" para diferenciarlo.
            // No buscamos -2, -3, etc. Siempre será -1 como indicador de duplicado de turno.
            idMove = `${idMove}-1`;
        }
    }

    try {
        const {
            itemID, serialesPorItem, reason, batch
        } = req.body;
        const foundItem = await Items.findById(itemID);
        if (!foundItem) 
            return res.status(404).json({ status: "error", message: "Item not found" });


        // 3. Guardar en la base de datos (Mongoose)
        const newRequest = new Quarantine({
            moveID: idMove,
            //consecutive: consecutivo,
            user: user._id,
            quarantineDate: new Date(),
            itemID,
            status: "Cuarentena",
            seriales: serialesPorItem,
            reason,
            batch,
            company: CompanyId
        });

        await newRequest.save();

        res.status(201).json({ status: "200", message: "Quarantine record Created", body: newRequest });

    } catch (error) {
        console.error("Error en createQUARequest:", error);
        res.status(500).json({ status: "500", message: "Internal Server Error" });
    }
};

//Metodo para obtener los registros
const getAllRegisters = async (req, res) => {
    const { CompanyId } = req.params
    console.log(CompanyId)
    if (CompanyId.length !== 24) {
        return;
    }
    const company = await Company.find({
        _id: { $in: CompanyId },
    })

    if (!company) {
        return;
    }

    const registers = await Quarantine.find({
        company: { $in: CompanyId },
    }).sort({ createdAt: 1 })
        .populate({
            path: "user",
            select: "employee",
            populate: { path: "employee", select: "name lastName" }
        })
        .populate({
            path: "modifiedby",
            select: "employee",
            populate: { path: "employee", select: "name lastName" }
        })
        .populate({
            path: "itemID",
            select: "name description uom currency unitCost itemGroup"
        })
        ;
    res.json({ status: "200", message: "Registros Loaded", body: registers });
};

const updateRegisters = async (req, res) => {
    const user = await User.findById(req.userId)

    if (!user) return res.status(404).json({ status: "error", message: "Error al buscar usuario" });

    try {
        const { moveID } = req.params;
        const {status, reason, batch, seriales } = req.body;
console.log(moveID)
        const updatequaRegisters = await Quarantine.updateOne(
                { _id: moveID },
                {$set: {
                status,
                reason,
                batch,
                seriales,
                modifiedby: req.userId
            }}
                );
          if (!updatequaRegisters) {
            res
                .status(403)
                .json({ status: "403", message: "Register not Updated", body: "" });
        }

        res.status(200).json({
            status: "200",
            message: "QUA Register Updated ",
            body: updatequaRegisters,
        });

    } catch (error) {
        console.error("Error en updateQUARegister:", error);
        res.status(500).json({ status: "500", message: "Internal Server Error" });
    }

}

const releaseFromQuarantine = async (req, res) => {
    try {
        const { CompanyId } = req.params;
        const { releaseType, records } = req.body; // records: [{ quarantineID, seriales }]

        if (!records || records.length === 0) {
            return res.status(400).json({ status: "error", message: "No se enviaron registros" });
        }
console.log(records)
        for (const record of records) {
            // Buscamos el documento completo de Mongoose para poder usar .save()
            const originalRecord = await Quarantine.findById(record.quarantineID);
            
            if (!originalRecord) continue; // Si no existe el registro, saltamos al siguiente

                // Liberación total
                originalRecord.status = "No Cuarentena";
                originalRecord.modifiedby = req.userId;
            await originalRecord.save();
        }

        return res.status(200).json({ status: "200", message: "Salida de cuarentena procesada con éxito" });
    } catch (error) {
        console.error("Error en releaseFromQuarantine:", error);
        return res.status(500).json({ status: "500", message: "Internal Server Error" });
    }
};

module.exports = {
    createQUARequest,
    getAllRegisters,
    updateRegisters,
    releaseFromQuarantine
}