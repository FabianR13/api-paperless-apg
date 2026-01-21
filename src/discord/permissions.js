const User = require('../models/User');
const Employee = require('../models/Employees');
const Role = require('../models/Role.js');
// ⚠️ IMPORTANTE: Aquí debes poner TU ID de Discord.
// Para obtenerlo: Activa modo desarrollador en Discord -> Clic derecho en tu usuario -> Copiar ID
const MASTER_ADMIN_ID = "1461503636583485543";

async function canCreateCourses(discordId) {
    // 1. GOD MODE: Si el ID coincide con el tuyo, SIEMPRE es true.
    if (discordId === MASTER_ADMIN_ID) {
        return true;
    }

    // 2. Lógica para empleados normales (Vinculados)
    try {
        const emp = await Employee.findOne({ discordId: discordId });
        if (!emp || !emp.active || !emp.user) return false;

        const webUser = await User.findOne({ employee: emp._id });
        if (!webUser) return false;

        const roles = await Role.find({ _id: { $in: webUser.roles } });

        let tienePermiso = false;
        for (let i = 0; i < roles.length; i++) {
            if (roles[i].name === "admin" || roles[i].name === "Instructor") {
                tienePermiso = true;
                break;
            }
        }

        return (tienePermiso);

    } catch (error) {
        console.error("Error verificando permisos:", error);
        return false;
    }
}

module.exports = { canCreateCourses };