// src/discord/deploy.js
require('dotenv').config({
  path: __dirname + '/../../.env'
}); // Ajusta la ruta a tu .env si es necesario


const {
  REST,
  Routes,
  SlashCommandBuilder
} = require('discord.js');

const commands = [// 1. VINCULAR
new SlashCommandBuilder().setName('vincular').setDescription('Accede al sistema usando tu número de empleado').addStringOption(option => option.setName('numero_empleado').setDescription('Tu ID de empleado (Ej. 12345)').setRequired(true)), // 2. CREAR CURSO (Actualizado para el Wizard)
new SlashCommandBuilder().setName('crear-curso').setDescription('Inicia el asistente para crear un nuevo curso').addStringOption(option => option.setName('titulo').setDescription('El título del curso').setRequired(true)).addStringOption(option => option.setName('categoria').setDescription('Departamento al que pertenece').setRequired(true).addChoices({
  name: 'Calidad',
  value: 'Calidad'
}, {
  name: 'Producción',
  value: 'Produccion'
}, {
  name: 'Procesos',
  value: 'Procesos'
}, {
  name: 'IT',
  value: 'IT'
}, {
  name: 'RH',
  value: 'RH'
}, {
  name: 'Seguridad',
  value: 'Seguridad'
})), // 3. VER CURSOS
new SlashCommandBuilder().setName('ver-cursos').setDescription('Muestra el catálogo de cursos disponibles'), // 4. MIS CURSOS
new SlashCommandBuilder().setName('mis-cursos').setDescription('Muestra tu progreso actual'), // 5. ASIGNAR CURSO (SOLO INSTRUCTORES)
new SlashCommandBuilder().setName('asignar-curso').setDescription('Inscribe forzosamente a un empleado en un curso').addStringOption(option => option.setName('numero_empleado').setDescription('El número de nómina del empleado (Ej. 0000)').setRequired(true)), // 6. REPORTE ADMINISTRATIVO
new SlashCommandBuilder().setName('admin-reporte').setDescription('Genera un reporte de progreso de un curso específico'), // 7. AYUDA (Manual de Usuario)
new SlashCommandBuilder().setName('ayuda').setDescription('Muestra la lista de comandos disponibles para tu perfil'), // 8. SETUP DE BIENVENIDA (Comando Maestro)
new SlashCommandBuilder().setName('setup-bienvenida').setDescription('Genera el panel gráfico de bienvenida en el canal actual (Solo Admin)'), // 9. BUSCAR CERTIFICADO (Herramienta Enroller)
new SlashCommandBuilder().setName('buscar-certificado').setDescription('Busca un certificado pasado y permite reenviarlo').addStringOption(option => option.setName('numero_empleado').setDescription('Nómina del empleado').setRequired(true)).addStringOption(option => option.setName('nombre_curso').setDescription('Nombre del curso').setRequired(true)), // 10. TEST CERTIFICADO (Herramienta de Diseño)
new SlashCommandBuilder().setName('test-certificado').setDescription('Genera un PDF de prueba para verificar fuentes y posiciones').addStringOption(option => option.setName('nombre_prueba').setDescription('Nombre del alumno ficticio (Opcional)').setRequired(false)).addStringOption(option => option.setName('curso_prueba').setDescription('Nombre del curso ficticio (Opcional)').setRequired(false)), // 11. ACTUALIZAR CURSO (Crear nueva versión)
new SlashCommandBuilder().setName('actualizar-curso').setDescription('Crea una nueva versión de un curso existente (Mantiene historial)').addStringOption(option => option.setName('curso_id').setDescription('ID del curso a actualizar (Úsalo desde el menú de instructor)').setRequired(true)), // 12. DESHABILITAR CURSO (Rechazar - Enroller)
new SlashCommandBuilder().setName('deshabilitar-curso').setDescription('Oculta un curso del catálogo y notifica al creador').addStringOption(option => option.setName('curso_id').setDescription('ID del curso').setRequired(true)).addStringOption(option => option.setName('motivo').setDescription('Razón del rechazo (Se enviará por DM)').setRequired(true)), // 13. AUDITAR CURSO (Ver contenido completo)
new SlashCommandBuilder().setName('auditar-curso').setDescription('Muestra videos, textos y RESPUESTAS correctas de un curso').addStringOption(option => option.setName('curso_id').setDescription('ID del curso').setRequired(true)), // 14. GENERAR LINK DE ACCESO (Herramienta RH)
new SlashCommandBuilder().setName('link-acceso').setDescription('Genera el enlace de invitación oficial para nuevos empleados'), // 15. REEVINCULAR EMPLEADO
new SlashCommandBuilder().setName('revincular').setDescription('Sincroniza roles de BD con Discord (Actualiza permisos)').addStringOption(option => option.setName('numero_empleado').setDescription('Nómina del empleado a re-evaluar').setRequired(true))].map(command => command.toJSON());
const rest = new REST({
  version: '10'
}).setToken(process.env.DISCORD_TOKEN);

(async () => {
  try {
    console.log('⏳ Registrando (o actualizando) comandos en Discord...');
    await rest.put(Routes.applicationGuildCommands(process.env.DISCORD_CLIENT_ID, process.env.DISCORD_GUILD_ID), {
      body: commands
    });
    console.log('✅ ¡Comandos registrados con éxito!');
    console.log('👉 Recuerda reiniciar tu bot con "npm run dev" o "node src/index.js"');
  } catch (error) {
    console.error('❌ Error registrando comandos:', error);
  }
})();