const Company = require("../models/Company");
const Employees = require("../models/Employees");
const PpeRequest = require("../models/PpeRequest");
const User = require("../models/User");

const getPPERequest = async (req, res) => {
    const { CompanyId } = req.params;

    if (CompanyId.length !== 24) {
        return res.status(400).json({ status: "400", message: "Invalid Company ID" });
    }

    try {
        const ppeRequest = await PpeRequest.find({
            company: CompanyId
        })
            .sort({ createdAt: -1 })
            .populate({
                path: 'issuerId',
                select: 'employee',
                populate: {
                    path: "employee",
                    select: 'name lastName'
                }
            })
            .populate({
                path: 'requesterId',
                select: 'employee',
                populate: {
                    path: "employee",
                    select: 'name lastName'
                }
            })
            .populate({
                path: 'employeeId',
                select: 'numberEmployee name lastName department position',
                populate: [
                    { path: "department", select: 'name' },
                    { path: "position", select: 'name' }
                ]
            })

        res.json({ status: "200", message: "PPE Request Loaded", body: ppeRequest });
    } catch (error) {
        console.error("Error fetching EPP Requisitions:", error);
        res.status(500).json({ status: "500", message: "Error fetching EPP Requisitions" });
    }
};

const createPPERequest = async (req, res) => {
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

    let turno;

    if (hourMX >= 7 && hourMX < 15) { // D: 7:00 a 12:59 hrs
        turno = 'D';
    } else if (hourMX >= 15 && hourMX < 23) {// A: 13:00 a 22:59 hrs
        turno = 'A';
    } else { // N: 23:00 a 06:59 hrs
        turno = 'N';
    }

    const idPedidoPrefix = `PPE-${newDate}-${turno}`;

    // Buscar el último pedido creado
    const lastPedido = await PpeRequest.findOne().sort({ createdAt: -1 });

    let consecutivo = 1;

    if (lastPedido && lastPedido.requestId) {
        const lastId = lastPedido.requestId;

        // (?:-\d+)? permite ignorar el "-1" si existe, capturando el número base en el grupo 2.
        // Ejemplo: Si lastId es "PPE-...-N001-1", captura "N" y "001".
        const idMatch = lastId.match(/PPE-\d{4}-\d{2}-\d{2}-([DAN])(\d+)(?:-\d+)?$/);

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
    let idPedido = `${idPedidoPrefix}${paddedConsecutivo}`; // Usamos 'let' para modificarlo si es necesario

    // --- VALIDACIÓN DE DUPLICADOS (SOLO TURNO N) ---
    if (turno === 'N') {
        // Verificamos si este ID base ya existe (conflicto madrugada vs noche)
        const existe = await PpeRequest.findOne({ idPedido: idPedido });

        if (existe) {
            // Si existe, simplemente agregamos "-1" para diferenciarlo.
            // No buscamos -2, -3, etc. Siempre será -1 como indicador de duplicado de turno.
            idPedido = `${idPedido}-1`;
        }
    }

    try {
        const {
            employeeId, reason, glovesSize,
            needsGlases, needsEarplugs, needsSideShields, delivered
        } = req.body;

        const foundEmployee = await Employees.findById(employeeId);

        if (!foundEmployee) {
            return res.status(404).json({ status: "error", message: "Empleado no encontrado" });
        }

        let images = [];
        if (req.file) {
            images.push(req.file.key);
        }

        // const anioActual = new Date().getFullYear();
        // const lastRequest = await PpeRequest.findOne({
        //     createdAt: {
        //         $gte: new Date(`${anioActual}-01-01T00:00:00.000Z`),
        //         $lt: new Date(`${anioActual + 1}-01-01T00:00:00.000Z`)
        //     }
        // }).sort({ consecutive: -1 });

        // const nextConsecutive = lastRequest ? lastRequest.consecutive + 1 : 1;
        // const generatedNumber = `APG-PPE-${anioActual}-${String(nextConsecutive).padStart(4, "0")}`;

        // 3. Guardar en la base de datos (Mongoose)
        const newRequest = new PpeRequest({
            requestId: idPedido,
            // consecutive: consecutivo,
            version: 1,
            requesterId: user._id,
            requesterDate: new Date(),
            employeeId,
            reason,
            requestStatus: "New",
            glovesSize,
            needsGlases,
            needsEarplugs,
            needsSideShields,
            delivered,
            images,
            company: CompanyId
        });

        await newRequest.save();

        res.status(201).json({ status: "200", message: "PPE Request Created", body: newRequest });

    } catch (error) {
        console.error("Error en createPPERequest:", error);
        res.status(500).json({ status: "500", message: "Internal Server Error" });
    }
};

const updatePPERequest = async (req, res) => {
    const { ppeRequestId } = req.params;
    const user = await User.findById(req.userId)

    if (!user) return res.status(404).json({ status: "error", message: "Error al buscar usuario" });

    try {
        const { delivered } = req.body;

        const updateQuery = {
            $set: {
                delivered,
                requestStatus: "Delivered",
                issuerId: user._id
            }
        };

        if (req.file) {
            updateQuery.$push = {
                images: req.file.key
            };
        }

        const updateppeRequest = await PpeRequest.updateOne(
            { _id: ppeRequestId },
            updateQuery
        );
        if (!updateppeRequest) {
            res
                .status(403)
                .json({ status: "403", message: "Request not Updated", body: "" });
        }

        res.status(200).json({
            status: "200",
            message: "PPE Request Updated ",
            body: updateppeRequest,
        });
    } catch (error) {
        console.error("Error en createPPERequest:", error);
        res.status(500).json({ status: "500", message: "Internal Server Error" });
    }
};

module.exports = {
    getPPERequest,
    createPPERequest,
    updatePPERequest
}