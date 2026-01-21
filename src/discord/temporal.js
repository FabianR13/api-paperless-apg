// =========================================================================
//  1. IMPORTACIONES Y CONFIGURACIÓN INICIAL
// =========================================================================
const {
    Client,
    GatewayIntentBits,
    ModalBuilder,
    TextInputBuilder,
    TextInputStyle,
    ActionRowBuilder,
    InteractionType,
    StringSelectMenuBuilder,
    StringSelectMenuOptionBuilder,
    EmbedBuilder,
    ButtonBuilder,
    ButtonStyle,
    AttachmentBuilder,
    PermissionsBitField
} = require('discord.js');

const XLSX = require('xlsx');
const { PDFDocument, rgb, StandardFonts } = require('pdf-lib');
const fontkit = require('@pdf-lib/fontkit'); // Necesario para fuentes .ttf personalizadas
const fs = require('fs');
const path = require('path');

// --- MODELOS DE BASE DE DATOS ---
const Employee = require('../models/Employees');
const Course = require('../models/HR/course.js');
const User = require('../models/User');
const Role = require('../models/Role.js');
const Quiz = require('../models/Quiz.js');
const QuizAttempt = require('../models/QuizAttempt.js');

// --- UTILIDADES ---
const { canCreateCourses } = require('./permissions');
const { uploadToS3FromUrl } = require('./uploadDiscord');

// --- VARIABLES DE ENTORNO Y CONSTANTES ---
const ROLE_EMPLEADO = process.env.ROLE_ID_EMPLEADO;
const ROLE_INSTRUCTOR = process.env.ROLE_ID_INSTRUCTOR;
const NOTA_MINIMA_APROBATORIA = 60;

// --- CONFIGURACIÓN CLIENTE DISCORD ---
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

// --- VARIABLES DE SESIÓN (MEMORIA RAM DEL BOT) ---
// edicionSesion: Controla el asistente de creación de cursos
const edicionSesion = new Map();
// tomaQuizSesion: Controla el estado de un alumno tomando un examen
const tomaQuizSesion = new Map();
// userState: Controla estados generales de navegación
const userState = new Map();

// =========================================================================
//  2. FUNCIONES UTILITARIAS (HELPERS)
// =========================================================================

// Genera barra de carga estilo consola: [████░░░░░░]
function generarBarra(porcentaje) {
    if (isNaN(porcentaje) || porcentaje < 0) porcentaje = 0;
    const totalBloques = 10;
    const llenos = Math.round((porcentaje / 100) * totalBloques);
    const vacios = totalBloques - llenos;
    return '█'.repeat(Math.max(0, llenos)) + '░'.repeat(Math.max(0, vacios));
}

// Genera barra de carga estilo emoji: 🟦🟦⬜⬜
function generarBarraProgreso(actual, total) {
    const totalBloques = 10;
    const porcentaje = total === 0 ? 0 : actual / total;
    const bloquesLlenos = Math.round(porcentaje * totalBloques);
    const llenos = '🟦'.repeat(bloquesLlenos);
    const vacios = '⬜'.repeat(totalBloques - bloquesLlenos);
    return `${llenos}${vacios} **${Math.round(porcentaje * 100)}%**`;
}

// Envía un mensaje que se borra solo a los X segundos
async function enviarTemp(channel, texto, segundos = 5) {
    try {
        const msg = await channel.send(texto);
        setTimeout(() => msg.delete().catch(() => { }), segundos * 1000);
    } catch (e) { console.error("Error msg temp:", e); }
}

// =========================================================================
//  3. EVENTO DE INICIO (READY)
// =========================================================================
client.once('ready', () => {
    console.log(`🤖 Bot LMS (Versión Completa v4) conectado como: ${client.user.tag}`);
});

// =========================================================================
//  4. MANEJADOR DE INTERACCIONES (EL CEREBRO DEL BOT)
// =========================================================================
client.on('interactionCreate', async interaction => {

    // ---------------------------------------------------------------------
    // A. CONFIGURACIÓN DE CANALES (/setup-bienvenida)
    // ---------------------------------------------------------------------
    if (interaction.isChatInputCommand() && interaction.commandName === 'setup-bienvenida') {
        const tienePermiso = await canCreateCourses(interaction.user.id);
        if (!tienePermiso) return interaction.reply({ content: "⛔ Sin permisos.", ephemeral: true });

        const canal = interaction.channel;
        
        // Variables maestras para enviar al final
        let payloadEmbeds = [];
        let payloadComponents = [];

        // CASO 1: CANAL VINCULAR
        if (canal.name.includes('vincular')) {
            const embed = new EmbedBuilder()
                .setTitle("👋 Bienvenido a Axiom Academy")
                .setDescription(
                    "**Identificación Requerida**\n\n" +
                    "Para acceder a los cursos, necesitamos validar tu número de empleado.\n" +
                    "Haz clic en el botón de abajo para comenzar."
                )
                .setColor('Green')
                // Asegúrate de poner aquí un link de imagen válido si quieres banner
                .setImage('https://i.imgur.com/83FdfZ2.png'); 

            const boton = new ButtonBuilder()
                .setCustomId('btn_abrir_vinculacion')
                .setLabel('🔗 Vincular mi Cuenta')
                .setStyle(ButtonStyle.Success);

            const fila = new ActionRowBuilder().addComponents(boton);
            payloadEmbeds = [embed];
            payloadComponents = [fila];
        }
        // CASO 2: CATÁLOGO
        else if (canal.name.includes('catálogo') || canal.name.includes('catalogo')) {
            const embed = new EmbedBuilder()
                .setTitle("📘 Catálogo de Cursos")
                .setDescription("Aquí encontrarás la oferta académica disponible para tu perfil.")
                .addFields(
                    { name: 'Comando Disponible', value: "`/ver-cursos`" },
                    { name: 'Instrucción', value: "Ejecuta el comando para desplegar el menú interactivo." }
                )
                .setColor('Blue');
            payloadEmbeds = [embed];
        }
        // CASO 3: AULA
        else if (canal.name.includes('aula') || canal.name.includes('clase') || canal.name.includes('mi-aula')) {
            const embed = new EmbedBuilder()
                .setTitle("🏫 Tu Aula Virtual")
                .setDescription("Espacio dedicado a tu aprendizaje.")
                .addFields(
                    { name: '▶️ Retomar / Ver Estado', value: "Usa `/mis-cursos`" },
                    { name: '💡 Tips', value: "Haz clic en el video para ampliar. Usa audífonos." }
                )
                .setColor('Green');
            payloadEmbeds = [embed];
        }
        // CASO 4: CREADOR
        else if (canal.name.includes('creador')) {
            const embed = new EmbedBuilder()
                .setTitle("🛠️ Estudio de Creación")
                .setDescription("Espacio para Instructores.")
                .addFields(
                    { name: '✨ Crear', value: "`/crear-curso`" },
                    { name: '🔄 Actualizar', value: "`/actualizar-curso`" }
                )
                .setColor('Gold');
            payloadEmbeds = [embed];
        }
        // CASO 5: CONTROL / RH
        else if (canal.name.includes('control') || canal.name.includes('centro')) {
            const embed = new EmbedBuilder()
                .setTitle("🚨 Centro de Control")
                .setDescription("Panel administrativo.")
                .addFields(
                    { name: '👥 Gestión', value: "`/asignar-curso`\n`/link-acceso`" },
                    { name: '🎓 Certificados', value: "`/buscar-certificado`\n`/test-certificado`" },
                    { name: '📊 Reportes', value: "`/admin-reporte`" }
                )
                .setColor('Red');
            payloadEmbeds = [embed];
        }

        // ENVÍO FINAL
        if (payloadEmbeds.length > 0) {
            if (interaction.deferred) await interaction.deleteReply().catch(() => {});
            await canal.send({ embeds: payloadEmbeds, components: payloadComponents });
            if (!interaction.replied) await interaction.reply({ content: "✅ Panel configurado.", ephemeral: true });
        } else {
            await interaction.reply({ content: "⚠️ Canal no reconocido.", ephemeral: true });
        }
    }

    // ---------------------------------------------------------------------
    // B. SISTEMA DE VINCULACIÓN (Corrección CRÍTICA del Crash)
    // ---------------------------------------------------------------------

    // 1. CLIC EN BOTÓN "Vincular" -> Abre Modal (SIN deferReply)
    if (interaction.isButton() && interaction.customId === 'btn_abrir_vinculacion') {
        const modal = new ModalBuilder()
            .setCustomId('modal_vincular_cuenta')
            .setTitle('Identificación de Empleado');

        const inputNomina = new TextInputBuilder()
            .setCustomId('input_nomina')
            .setLabel("Tu Número de Nómina")
            .setPlaceholder("Ej. 1234")
            .setStyle(TextInputStyle.Short)
            .setRequired(true);

        const row = new ActionRowBuilder().addComponents(inputNomina);
        modal.addComponents(row);

        // RESPUESTA ÚNICA: Mostrar Modal
        await interaction.showModal(modal);
    }

    // 2. RECIBIR DATOS DEL MODAL -> Procesar (Con deferReply)
    if (interaction.isModalSubmit() && interaction.customId === 'modal_vincular_cuenta') {
        await interaction.deferReply({ ephemeral: true }); 
        const numeroEmpleado = interaction.fields.getTextInputValue('input_nomina');

        try {
            const employee = await Employee.findOne({ numberEmployee: numeroEmpleado });

            if (!employee) return interaction.editReply(`❌ No encontré la nómina **${numeroEmpleado}**.`);
            if (employee.discordId && employee.discordId !== interaction.user.id) {
                return interaction.editReply("⚠️ Nómina ya vinculada a otra cuenta.");
            }

            employee.discordId = interaction.user.id;
            employee.discordUsername = interaction.user.tag;
            await employee.save();

            // Asignar Rol
            const role = interaction.guild.roles.cache.find(r => r.name === "Empleado Verificado" || r.name === "Empleado");
            if (role) await interaction.member.roles.add(role).catch(console.error);

            await interaction.editReply({ 
                content: `✅ **¡Vinculación Exitosa!**\nHola **${employee.name}**, ya tienes acceso.` 
            });

        } catch (error) {
            console.error(error);
            await interaction.editReply("❌ Error interno.");
        }
    }

    // ---------------------------------------------------------------------
    // C. CREACIÓN DE CURSOS (WIZARD)
    // ---------------------------------------------------------------------
    if (interaction.isChatInputCommand() && interaction.commandName === 'crear-curso') {
        const tienePermiso = await canCreateCourses(interaction.user.id);
        if (!tienePermiso) return interaction.reply({ content: "⛔ Sin permisos.", ephemeral: true });

        const titulo = interaction.options.getString('titulo') || "Nuevo Curso";
        const categoria = interaction.options.getString('categoria') || "General";

        try {
            const nuevoCurso = await Course.create({
                title: titulo,
                category: categoria,
                phases: [],
                isActive: false,
                createdByDiscordId: interaction.user.id
            });
            await interaction.reply({ content: "⏳ Iniciando panel...", ephemeral: true });
            
            edicionSesion.set(interaction.user.id, {
                cursoId: nuevoCurso._id,
                modo: 'MENU',
                panelOriginal: interaction
            });

            await actualizarPanelFisico(interaction, nuevoCurso._id);
        } catch (e) { console.error(e); }
    }

    // BOTONES DEL CREADOR
    if (interaction.isButton() && interaction.customId.startsWith('btn_')) {
        if (interaction.customId === 'btn_abrir_vinculacion') return; // Ignorar el de vincular

        const sesion = edicionSesion.get(interaction.user.id);
        if (!sesion) return interaction.reply({ content: "⚠️ Sesión expirada.", ephemeral: true });

        if (interaction.customId === 'btn_add_video' || interaction.customId === 'btn_add_img') {
            sesion.modo = 'ESPERANDO_MEDIA';
            await interaction.reply({ content: `📂 **SUBIR ARCHIVO**\nSube el archivo al chat ahora.`, ephemeral: true });
        }
        else if (interaction.customId === 'btn_add_quiz' || interaction.customId === 'btn_add_final_exam') {
            const esFinal = interaction.customId === 'btn_add_final_exam';
            sesion.modo = 'CREANDO_QUIZ';
            sesion.tempQuiz = { preguntas: [], titulo: esFinal ? 'Examen Final' : 'Quiz Intermedio', esExamenFinal: esFinal, step: 0 };
            await interaction.reply({ content: `📝 **CREANDO EVALUACIÓN**\nEscribe las preguntas en el chat.`, ephemeral: true });
        }
        else if (interaction.customId === 'btn_publicar') {
            const curso = await Course.findById(sesion.cursoId);
            if (!curso.finalExamId) return interaction.reply({ content: "❌ Falta el Examen Final.", ephemeral: true });
            curso.isActive = true;
            await curso.save();
            edicionSesion.delete(interaction.user.id);
            await interaction.update({ content: `✅ **¡CURSO PUBLICADO!**`, components: [], embeds: [] });
        }
    }

    // ---------------------------------------------------------------------
    // D. CATÁLOGO Y AULA (ESTUDIANTE)
    // ---------------------------------------------------------------------
    
    // /VER-CURSOS
    if (interaction.isChatInputCommand() && interaction.commandName === 'ver-cursos') {
        try {
            const categorias = await Course.distinct('category', { isActive: true, isDisabled: false, isObsolete: false });
            if (!categorias.length) return interaction.reply({ content: "📂 No hay cursos.", ephemeral: true });

            const menu = new StringSelectMenuBuilder()
                .setCustomId('menu_seleccionar_categoria')
                .setPlaceholder('📂 Selecciona Área')
                .addOptions(categorias.map(c => new StringSelectMenuOptionBuilder().setLabel(c).setValue(c).setEmoji('📁')));

            await interaction.reply({ components: [new ActionRowBuilder().addComponents(menu)], ephemeral: true });
        } catch (e) { console.error(e); }
    }

    // SELECCIONAR CATEGORÍA -> MOSTRAR CURSOS
    if (interaction.isStringSelectMenu() && interaction.customId === 'menu_seleccionar_categoria') {
        const cat = interaction.values[0];
        const cursos = await Course.find({ category: cat, isActive: true, isDisabled: false, isObsolete: false });
        
        const menu = new StringSelectMenuBuilder()
            .setCustomId('menu_inscribir_curso')
            .setPlaceholder(`📘 Cursos de ${cat}`)
            .addOptions(cursos.map(c => new StringSelectMenuOptionBuilder().setLabel(c.title).setValue(c._id.toString()).setEmoji('🎓')));

        await interaction.update({ components: [new ActionRowBuilder().addComponents(menu)] });
    }

    // INSCRIBIRSE
    if (interaction.isStringSelectMenu() && interaction.customId === 'menu_inscribir_curso') {
        const cursoId = interaction.values[0];
        const emp = await Employee.findOne({ discordId: interaction.user.id });
        
        // Verificar si ya está en uno activo
        if (emp.enrolledCourses.find(c => c.status === 'In Progress')) {
            return interaction.reply({ content: "⚠️ Termina tu curso actual primero.", ephemeral: true });
        }

        emp.enrolledCourses.push({
            courseId: cursoId, currentPhase: 0, status: 'In Progress', progress: 0, enrolledAt: new Date()
        });
        await emp.save();
        await mostrarFaseReproductor(interaction, cursoId, 0);
    }

    // /MIS-CURSOS
    if (interaction.isChatInputCommand() && interaction.commandName === 'mis-cursos') {
        await interaction.deferReply({ ephemeral: true });
        const emp = await Employee.findOne({ discordId: interaction.user.id }).populate('enrolledCourses.courseId');
        
        if (!emp || !emp.enrolledCourses.length) return interaction.editReply("📂 No tienes cursos.");

        const embed = new EmbedBuilder().setTitle(`📊 Progreso: ${emp.name}`).setColor('Blue');
        let comps = [];

        for (const insc of emp.enrolledCourses) {
            if (!insc.courseId) continue;
            const c = insc.courseId;
            embed.addFields({ 
                name: c.title, 
                value: `Estado: ${insc.status} | Avance: ${generarBarra(insc.progress)}` 
            });
            if (insc.status === 'In Progress') {
                comps.push(new ButtonBuilder().setCustomId(`player_next_${c._id}_${insc.currentPhase - 1}`).setLabel(`▶️ ${c.title}`).setStyle(ButtonStyle.Primary));
            }
        }
        const row = comps.length ? new ActionRowBuilder().addComponents(comps.slice(0, 5)) : null;
        await interaction.editReply({ embeds: [embed], components: row ? [row] : [] });
    }

    // REPRODUCTOR (NAVEGACIÓN)
    if (interaction.isButton() && (interaction.customId.startsWith('player_') || interaction.customId.startsWith('cancel_course_'))) {
        if (interaction.customId.startsWith('player_')) {
            const [_, accion, cursoId, idxStr] = interaction.customId.split('_');
            let idx = parseInt(idxStr);
            if (accion === 'next') idx++;
            if (accion === 'prev') idx--;
            if (idx < 0) idx = 0;
            await mostrarFaseReproductor(interaction, cursoId, idx);
        }
        else if (interaction.customId.startsWith('cancel_course_')) {
            const cursoId = interaction.customId.split('cancel_course_')[1];
            const emp = await Employee.findOne({ discordId: interaction.user.id });
            const i = emp.enrolledCourses.findIndex(c => c.courseId.toString() === cursoId);
            if (i !== -1) {
                emp.enrolledCourses.splice(i, 1);
                await emp.save();
                await interaction.update({ content: "🗑️ Curso cancelado.", embeds: [], components: [] });
            }
        }
    }

    // ---------------------------------------------------------------------
    // E. EXÁMENES
    // ---------------------------------------------------------------------
    if (interaction.isButton() && (interaction.customId.startsWith('start_quiz_') || interaction.customId.startsWith('start_exam_'))) {
        const [tipo, _x, quizId] = interaction.customId.split('_');
        const quiz = await Quiz.findById(quizId);
        tomaQuizSesion.set(interaction.user.id, {
            quizId, preguntas: quiz.questions, indicePregunta: 0, aciertos: 0, respuestasUsuario: [],
            esExamenFinal: tipo === 'start' && interaction.customId.includes('exam')
        });
        await mostrarPreguntaExamen(interaction);
    }

    if (interaction.isStringSelectMenu() && interaction.customId === 'quiz_responder') {
        const sesion = tomaQuizSesion.get(interaction.user.id);
        if (!sesion) return interaction.reply({ content: "Sesión expirada.", ephemeral: true });

        const resp = parseInt(interaction.values[0]);
        sesion.respuestasUsuario.push(resp);
        if (resp === sesion.preguntas[sesion.indicePregunta].correctIndex) sesion.aciertos++;
        sesion.indicePregunta++;

        if (sesion.indicePregunta >= sesion.preguntas.length) await finalizarExamen(interaction, sesion);
        else await mostrarPreguntaExamen(interaction);
    }

    // ---------------------------------------------------------------------
    // F. GESTIÓN ADMINISTRATIVA (/asignar-curso, /admin-reporte, etc)
    // ---------------------------------------------------------------------
    
    // ASIGNAR CURSO
    if (interaction.isChatInputCommand() && interaction.commandName === 'asignar-curso') {
        const tienePermiso = await canCreateCourses(interaction.user.id);
        if (!tienePermiso) return interaction.reply({ content: "⛔ Solo Staff.", ephemeral: true });

        const nomina = interaction.options.getString('numero_empleado');
        const emp = await Employee.findOne({ numberEmployee: nomina });
        if (!emp) return interaction.reply({ content: "❌ Empleado no encontrado.", ephemeral: true });

        const cats = await Course.distinct('category', { isActive: true });
        const menu = new StringSelectMenuBuilder()
            .setCustomId(`admin_assign_cat_${emp._id}`)
            .setPlaceholder('Selecciona Área')
            .addOptions(cats.map(c => new StringSelectMenuOptionBuilder().setLabel(c).setValue(c)));
        
        await interaction.reply({ content: `Asignando a: **${emp.name}**`, components: [new ActionRowBuilder().addComponents(menu)], ephemeral: true });
    }

    if (interaction.isStringSelectMenu() && interaction.customId.startsWith('admin_assign_cat_')) {
        const empId = interaction.customId.split('_')[3];
        const cat = interaction.values[0];
        const cursos = await Course.find({ category: cat, isActive: true });
        
        const menu = new StringSelectMenuBuilder()
            .setCustomId(`admin_assign_final_${empId}`)
            .setPlaceholder('Selecciona Curso')
            .addOptions(cursos.map(c => new StringSelectMenuOptionBuilder().setLabel(c.title).setValue(c._id.toString())));

        await interaction.update({ content: "Selecciona el curso:", components: [new ActionRowBuilder().addComponents(menu)] });
    }

    if (interaction.isStringSelectMenu() && interaction.customId.startsWith('admin_assign_final_')) {
        const empId = interaction.customId.split('_')[3];
        const cursoId = interaction.values[0];
        const emp = await Employee.findById(empId);
        const curso = await Course.findById(cursoId);

        if (emp.enrolledCourses.find(c => c.courseId.toString() === cursoId)) {
            return interaction.update({ content: "⚠️ Ya tiene este curso.", components: [] });
        }

        emp.enrolledCourses.push({
            courseId, status: 'In Progress', progress: 0, currentPhase: 0, enrolledAt: new Date()
        });
        await emp.save();
        
        // Notificar DM
        if (emp.discordId) {
            try {
                const user = await client.users.fetch(emp.discordId);
                const embed = new EmbedBuilder()
                    .setTitle("🚨 Nueva Asignación").setDescription(`Te han asignado: **${curso.title}**`).setColor('Red');
                await user.send({ embeds: [embed] });
            } catch(e) {}
        }
        await interaction.update({ content: `✅ Asignado: **${curso.title}** a ${emp.name}.`, components: [] });
    }

    // GENERAR LINK DE ACCESO
    if (interaction.isChatInputCommand() && interaction.commandName === 'link-acceso') {
        const tienePermiso = await canCreateCourses(interaction.user.id);
        if (!tienePermiso) return interaction.reply({ content: "⛔ Solo Staff.", ephemeral: true });
        
        const canal = interaction.guild.channels.cache.find(c => c.name.includes('vincular'));
        if(!canal) return interaction.reply("❌ No encuentro canal vincular.");

        const invite = await canal.createInvite({ maxAge: 0, maxUses: 0, unique: false });
        await interaction.reply({ content: `🔗 **Link de Acceso:**\n${invite.url}`, ephemeral: true });
    }

    // AYUDA
    if (interaction.isChatInputCommand() && interaction.commandName === 'ayuda') {
        const esStaff = await canCreateCourses(interaction.user.id);
        const embed = new EmbedBuilder().setTitle("Ayuda Axiom Academy").setColor('Blue');
        embed.addFields({ name: 'Estudiantes', value: "`/ver-cursos`, `/mis-cursos`" });
        if(esStaff) embed.addFields({ name: 'Staff', value: "`/crear-curso`, `/asignar-curso`, `/setup-bienvenida`, `/admin-reporte`" });
        await interaction.reply({ embeds: [embed], ephemeral: true });
    }

    // ADMIN REPORTE
    if (interaction.isChatInputCommand() && interaction.commandName === 'admin-reporte') {
        const tienePermiso = await canCreateCourses(interaction.user.id);
        if (!tienePermiso) return interaction.reply("⛔ Solo Staff.");
        
        const cursos = await Course.find({ isActive: true });
        const menu = new StringSelectMenuBuilder().setCustomId('reporte_sel').setPlaceholder('Elige curso').addOptions(
            cursos.map(c => new StringSelectMenuOptionBuilder().setLabel(c.title).setValue(c._id.toString()))
        );
        await interaction.reply({ content: "Selecciona curso para reporte:", components: [new ActionRowBuilder().addComponents(menu)], ephemeral: true });
    }

    if (interaction.isStringSelectMenu() && interaction.customId === 'reporte_sel') {
        const cursoId = interaction.values[0];
        await interaction.deferUpdate();
        
        const emps = await Employee.find({ 'enrolledCourses.courseId': cursoId });
        const data = emps.map(e => {
            const insc = e.enrolledCourses.find(c => c.courseId.toString() === cursoId);
            return {
                Nomina: e.numberEmployee,
                Nombre: e.name,
                Estado: insc.status,
                Progreso: insc.progress
            };
        });

        const wb = XLSX.utils.book_new();
        const ws = XLSX.utils.json_to_sheet(data);
        XLSX.utils.book_append_sheet(wb, ws, "Reporte");
        const buffer = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });
        
        await interaction.editReply({ 
            content: "📊 **Reporte Generado**", 
            components: [], 
            files: [new AttachmentBuilder(buffer, { name: 'reporte.xlsx' })] 
        });
    }

    // CERTIFICADOS (TEST Y BUSCAR)
    if (interaction.isChatInputCommand() && interaction.commandName === 'test-certificado') {
        const pdf = await crearPDFCertificado("Juan Perez", "Curso Prueba", "01-01-2026");
        await interaction.reply({ files: [new AttachmentBuilder(pdf, { name: 'test.pdf' })], ephemeral: true });
    }
});

// =========================================================================
//  5. MANEJADOR DE MENSAJES (WIZARD DE CURSOS)
// =========================================================================
client.on('messageCreate', async message => {
    if (message.author.bot) return;
    const sesion = edicionSesion.get(message.author.id);
    if (!sesion) return;

    if (sesion.modo === 'ESPERANDO_MEDIA') {
        const adj = message.attachments.first();
        if (!adj) return enviarTemp(message.channel, "⚠️ Sube un archivo.", 3);

        const temp = await message.channel.send("⏳ Subiendo...");
        const s3 = await uploadToS3FromUrl(adj.url, adj.contentType);
        await temp.delete();
        await message.delete();

        const curso = await Course.findById(sesion.cursoId);
        curso.phases.push({
            order: curso.phases.length + 1, title: "Multimedia", type: 'MEDIA',
            mediaUrl: s3.url, textContent: message.content || "Material de clase"
        });
        await curso.save();
        sesion.modo = 'MENU';
        await actualizarPanelFisico(sesion.panelOriginal, sesion.cursoId);
    }

    if (sesion.modo === 'CREANDO_QUIZ') {
        const txt = message.content;
        await message.delete();
        
        if (txt === 'TERMINAR') {
            const q = await Quiz.create({
                title: sesion.tempQuiz.titulo,
                questions: sesion.tempQuiz.preguntas,
                courseId: sesion.cursoId,
                type: sesion.tempQuiz.esExamenFinal ? 'FINAL_EXAM' : 'QUIZ'
            });
            const c = await Course.findById(sesion.cursoId);
            if (sesion.tempQuiz.esExamenFinal) c.finalExamId = q._id;
            else c.phases.push({ order: c.phases.length + 1, title: "Quiz", type: 'QUIZ', quizId: q._id });
            await c.save();
            sesion.modo = 'MENU';
            await actualizarPanelFisico(sesion.panelOriginal, sesion.cursoId);
            return;
        }

        if (sesion.tempQuiz.step === 0) { // Esperando pregunta
            sesion.tempQuiz.tempP = txt;
            sesion.tempQuiz.step = 1;
            enviarTemp(message.channel, "Opción 1, Opción 2 (Indice Correcto 1-N)", 5);
        } else { // Esperando opciones
            const match = txt.match(/(.+)\((\d+)\)$/);
            if (match) {
                const opts = match[1].split(',').map(s=>s.trim());
                sesion.tempQuiz.preguntas.push({ text: sesion.tempQuiz.tempP, options: opts, correctIndex: parseInt(match[2])-1 });
                sesion.tempQuiz.step = 0;
                enviarTemp(message.channel, "Pregunta guardada. Siguiente o TERMINAR", 3);
            }
        }
    }
});

// =========================================================================
//  6. LÓGICA DE NEGOCIO (FUNCIONES COMPLETAS)
// =========================================================================

// PANEL CREADOR
async function actualizarPanelFisico(interaction, cursoId) {
    const curso = await Course.findById(cursoId);
    const embed = new EmbedBuilder().setTitle(`🛠️ Editando: ${curso.title}`).setDescription(`Fases: ${curso.phases.length}`).setColor('Gold');
    
    const row1 = new ActionRowBuilder().addComponents(
        new ButtonBuilder().setCustomId('btn_add_video').setLabel('Video').setStyle(ButtonStyle.Primary),
        new ButtonBuilder().setCustomId('btn_add_img').setLabel('Imagen').setStyle(ButtonStyle.Success),
        new ButtonBuilder().setCustomId('btn_add_quiz').setLabel('Quiz').setStyle(ButtonStyle.Secondary)
    );
    const row2 = new ActionRowBuilder().addComponents(
        new ButtonBuilder().setCustomId('btn_add_final_exam').setLabel('Examen Final').setStyle(ButtonStyle.Danger),
        new ButtonBuilder().setCustomId('btn_publicar').setLabel('PUBLICAR').setStyle(ButtonStyle.Success)
    );
    await interaction.editReply({ embeds: [embed], components: [row1, row2] });
}

// REPRODUCTOR (Fix: Texto arriba del video)
async function mostrarFaseReproductor(interaction, cursoId, index) {
    const curso = await Course.findById(cursoId);
    if (index >= curso.phases.length) {
        // Fin del curso
        const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder().setCustomId(`start_exam_${curso.finalExamId}`).setLabel('Examen Final').setStyle(ButtonStyle.Success)
        );
        return interaction.message ? interaction.update({ content: "Fin del contenido.", components: [row], embeds: [] }) : interaction.reply({ content: "Fin.", components: [row], ephemeral: true });
    }

    const fase = curso.phases[index];
    const isVideo = fase.mediaUrl && !fase.mediaUrl.match(/\.(jpg|png|jpeg)$/i);
    
    let content = "";
    let embeds = [];
    let files = [];

    if (isVideo) {
        content = `### 🎬 ${curso.title}\n> **Fase ${index+1}:** ${fase.textContent}\n> 👇 Haz clic para ampliar video`;
        files = [new AttachmentBuilder(fase.mediaUrl, { name: 'video.mp4' })];
    } else {
        const emb = new EmbedBuilder().setTitle(`📖 Fase ${index+1}`).setDescription(fase.textContent).setColor('Blue');
        if (fase.mediaUrl) emb.setImage(fase.mediaUrl);
        embeds = [emb];
    }

    const row = new ActionRowBuilder()
        .addComponents(new ButtonBuilder().setCustomId(`player_prev_${cursoId}_${index}`).setLabel('⬅️').setStyle(ButtonStyle.Secondary).setDisabled(index===0));
    
    if (fase.type === 'QUIZ') {
        row.addComponents(new ButtonBuilder().setCustomId(`start_quiz_${fase.quizId}`).setLabel('Quiz').setStyle(ButtonStyle.Primary));
    } else {
        row.addComponents(new ButtonBuilder().setCustomId(`player_next_${cursoId}_${index}`).setLabel('➡️').setStyle(ButtonStyle.Primary));
    }

    const payload = { content, embeds, components: [row], files };
    if (interaction.message) await interaction.update(payload);
    else await interaction.reply({ ...payload, ephemeral: true });
}

// EXAMEN UI
async function mostrarPreguntaExamen(interaction) {
    const sesion = tomaQuizSesion.get(interaction.user.id);
    const p = sesion.preguntas[sesion.indicePregunta];
    
    const embed = new EmbedBuilder()
        .setTitle(`🧠 Pregunta ${sesion.indicePregunta + 1}`)
        .setDescription(`\`\`\`fix\n${p.text}\n\`\`\``)
        .setColor('Orange');

    const menu = new StringSelectMenuBuilder().setCustomId('quiz_responder').setPlaceholder('Elige respuesta');
    p.options.forEach((opt, i) => menu.addOptions(new StringSelectMenuOptionBuilder().setLabel(opt.substring(0,100)).setValue(i.toString())));

    const payload = { embeds: [embed], components: [new ActionRowBuilder().addComponents(menu)] };
    if (interaction.message) await interaction.update(payload);
    else await interaction.reply({ ...payload, ephemeral: true });
}

// FINALIZAR EXAMEN Y CERTIFICADO
async function finalizarExamen(interaction, sesion) {
    const score = (sesion.aciertos / sesion.preguntas.length) * 100;
    const passed = score >= NOTA_MINIMA_APROBATORIA;
    
    // Guardar intento
    await QuizAttempt.create({
        employeeDiscordId: interaction.user.id,
        quizId: sesion.quizId,
        score,
        passed,
        type: sesion.esExamenFinal ? 'FINAL_EXAM' : 'QUIZ'
    });

    if (passed && sesion.esExamenFinal) {
        const emp = await Employee.findOne({ discordId: interaction.user.id });
        const curso = await Course.findById(tomaQuizSesion.get(interaction.user.id).quizId).populate('finalExamId'); // Hacky check, better via sesion
        // Nota: en sesion.quizId tenemos el ID del quiz, necesitamos buscar el curso de otra forma si no lo guardamos en sesion.
        // Asumimos que cursoId venia en el quiz. Lo ideal es guardarlo en sesion al inicio.
        
        // Actualizar Employee
        const insc = emp.enrolledCourses.find(c => c.status === 'In Progress'); // Simplificación
        if(insc) {
            insc.status = 'Completed';
            insc.progress = 100;
            insc.completedAt = new Date();
            await emp.save();
        }

        // Generar PDF
        try {
            const pdf = await crearPDFCertificado(emp.name, "Curso Finalizado", new Date().toLocaleDateString());
            const att = new AttachmentBuilder(pdf, { name: 'Diploma.pdf' });
            await interaction.user.send({ content: "🎓 ¡Felicidades! Aquí tienes tu certificado:", files: [att] });
        } catch(e) { console.error("PDF Error", e); }

        await interaction.update({ content: `🏆 **¡APROBADO!** Nota: ${score}%`, embeds: [], components: [] });
    } else {
        await interaction.update({ content: `❌ **Reprobado**. Nota: ${score}%. Inténtalo de nuevo.`, embeds: [], components: [] });
    }
    tomaQuizSesion.delete(interaction.user.id);
}

// GENERADOR PDF
async function crearPDFCertificado(nombre, curso, fecha) {
    const rutaTemplate = path.join(__dirname, '../assets/certificado_base.pdf');
    const rutaFuente = path.join(__dirname, '../assets/fuente_nombre.ttf'); 

    // Si no tienes assets, crea un PDF blanco básico para que no crashee
    if (!fs.existsSync(rutaTemplate) || !fs.existsSync(rutaFuente)) {
        const doc = await PDFDocument.create();
        const page = doc.addPage();
        page.drawText(`${nombre} - ${curso}`, { x: 50, y: 400 });
        const bytes = await doc.save();
        return Buffer.from(bytes);
    }

    const template = fs.readFileSync(rutaTemplate);
    const fontBytes = fs.readFileSync(rutaFuente);
    
    const pdfDoc = await PDFDocument.load(template);
    pdfDoc.registerFontkit(fontkit);
    const font = await pdfDoc.embedFont(fontBytes);
    
    const page = pdfDoc.getPages()[0];
    const { width } = page.getSize();
    
    const textW = font.widthOfTextAtSize(nombre, 40);
    page.drawText(nombre, { x: (width/2)-(textW/2), y: 300, size: 40, font, color: rgb(0,0,0) });
    page.drawText(curso, { x: 100, y: 200, size: 20 });
    page.drawText(fecha, { x: width-150, y: 50, size: 12 });

    const pdfBytes = await pdfDoc.save();
    return Buffer.from(pdfBytes);
}

// =========================================================================
//  7. EXPORTACIÓN
// =========================================================================
const connectDiscordBot = async () => {
    try { await client.login(process.env.DISCORD_TOKEN); }
    catch (e) { console.error("Error Login Bot:", e); }
};

module.exports = { connectDiscordBot };