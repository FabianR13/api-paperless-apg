//  LIBRERÍAS E IMPORTACIONES
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
  AttachmentBuilder
} = require('discord.js');

const XLSX = require('xlsx');

const {
  PDFDocument,
  rgb,
  StandardFonts
} = require('pdf-lib');

const fs = require('fs');

const path = require('path'); // --- MODELOS ---


const Employee = require('../models/Employees');

const Course = require('../models/HR/course.js');

const User = require('../models/User');

const Role = require('../models/Role.js');

const Quiz = require('../models/Quiz.js');

const QuizAttempt = require('../models/QuizAttempt.js'); // --- UTILIDADES ---


const {
  canCreateCourses
} = require('./permissions');

const {
  uploadToS3FromUrl
} = require('./uploadDiscord'); // --- VARIABLES DE ENTORNO ---


const ROLE_EMPLEADO = process.env.ROLE_ID_EMPLEADO;
const ROLE_INSTRUCTOR = process.env.ROLE_ID_INSTRUCTOR;
const ROLE_ENROLLER = process.env.ROLE_ID_ENROLLER;
const NOTA_MINIMA_APROBATORIA = 60; // --- CONFIGURACIÓN CLIENTE DISCORD ---

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent]
}); // --- VARIABLES DE SESIÓN ---

const edicionSesion = new Map();
const tomaQuizSesion = new Map(); // Helper visual para barra de carga

function generarBarra(porcentaje) {
  if (isNaN(porcentaje) || porcentaje < 0) porcentaje = 0;
  const totalBloques = 10;
  const llenos = Math.round(porcentaje / 100 * totalBloques);
  const vacios = totalBloques - llenos;
  return '█'.repeat(Math.max(0, llenos)) + '░'.repeat(Math.max(0, vacios));
} // Helper para mensajes temporales


async function enviarTemp(channel, texto, segundos = 5) {
  try {
    const msg = await channel.send(texto);
    setTimeout(() => msg.delete().catch(() => {}), segundos * 1000);
  } catch (e) {
    console.error("Error msg temp:", e);
  }
}

client.once('ready', () => {
  console.log(`🤖 Bot LMS (Versión Blindada v2) conectado como: ${client.user.tag}`);
}); //  MANEJO DE INTERACCIONES

client.on('interactionCreate', async interaction => {
  //--------------------------------------------------------------------
  // 1 COMANDO: /SETUP-BIENVENIDA 
  if (interaction.isChatInputCommand() && interaction.commandName === 'setup-bienvenida') {
    const tienePermiso = await canCreateCourses(interaction.user.id);
    if (!tienePermiso) return interaction.reply({
      content: "⛔ Sin permisos.",
      ephemeral: true
    });
    const canal = interaction.channel;
    let payloadEmbeds = [];
    let payloadComponents = []; // A. CANAL DE VINCULACIÓN

    if (canal.name.includes('vincular')) {
      const embed = new EmbedBuilder().setTitle("👋 Bienvenido a Axiom Academy").setDescription("**Identificación Requerida**\n\n" + "Para acceder a los cursos, necesitamos validar tu número de empleado.\n" + "Haz clic en el botón de abajo para comenzar.").setColor('Green');
      const boton = new ButtonBuilder().setCustomId('btn_abrir_vinculacion').setLabel('🔗 Vincular mi Cuenta').setStyle(ButtonStyle.Success);
      const fila = new ActionRowBuilder().addComponents(boton);
      payloadEmbeds = [embed];
      payloadComponents = [fila];
    } // B. CANAL DE CATÁLOGO
    else if (canal.name.includes('catálogo') || canal.name.includes('catalogo')) {
      const embed = new EmbedBuilder().setTitle("📘 Catálogo de Cursos").setDescription("Aquí encontrarás la oferta académica disponible para tu perfil.").addFields({
        name: 'Comando Disponible',
        value: "`/ver-cursos`"
      }, {
        name: 'Instrucción',
        value: "Ejecuta el comando para desplegar el menú interactivo e inscribirte."
      }).setColor('Blue');
      payloadEmbeds = [embed];
    } // C. CANAL DE AULA
    else if (canal.name.includes('aula') || canal.name.includes('clase') || canal.name.includes('mi-aula')) {
      const embed = new EmbedBuilder().setTitle("🏫 Tu Aula Virtual").setDescription("Espacio dedicado a tu aprendizaje. Aquí interactuarás con los videos y exámenes.").addFields({
        name: '▶️ Retomar / Ver Estado',
        value: "Usa `/mis-cursos`"
      }, {
        name: '💡 Mejor Experiencia de Visualización',
        value: "Para evitar que el curso se vea pequeño como un chat:\n" + "1️⃣ **Haz clic sobre el video** para abrirlo en modo teatro.\n" + "2️⃣ **Oculta la lista de miembros** (Icono de personas arriba a la derecha o `Ctrl + U`).\n" + "3️⃣ Usa audífonos para mejor concentración."
      }).setColor('Green');
      payloadEmbeds = [embed];
    } // D. CANAL DE CREADOR
    else if (canal.name.includes('creador')) {
      const embed = new EmbedBuilder().setTitle("🛠️ Estudio de Creación de Contenido").setDescription("Espacio de trabajo para Diseñadores Instruccionales e Instructores.").addFields({
        name: '✨ Crear Nuevo',
        value: "`/crear-curso`\nInicia el asistente."
      }, {
        name: '🔄 Crear Versión (v2)',
        value: "`/actualizar-curso`\nNueva versión manteniendo historial."
      }, {
        name: '⚠️ Reglas',
        value: "El bot limpia el chat tras la carga de archivos."
      }).setColor('Gold');
      payloadEmbeds = [embed];
    } // E. CANAL DE CONTROL (RH)
    else if (canal.name.includes('control') || canal.name.includes('centro')) {
      const embed = new EmbedBuilder().setTitle("🚨 Centro de Control (RRHH & Calidad)").setDescription("Panel administrativo para gestión de talento.").addFields({
        name: '👥 Gestión',
        value: "`/asignar-curso` (Manual)\n`/link-acceso` (Invitación)"
      }, {
        name: '🎓 Certificados',
        value: "`/buscar-certificado`\n`/test-certificado`"
      }, {
        name: '🛡️ Calidad',
        value: "`/auditar-curso`\n`/deshabilitar-curso`"
      }, {
        name: '📊 Reportes',
        value: "`/admin-reporte`"
      }).setColor('Red').setThumbnail('https://cdn-icons-png.flaticon.com/512/9322/9322127.png');
      payloadEmbeds = [embed];
    }

    if (payloadEmbeds.length > 0) {
      if (interaction.deferred) await interaction.deleteReply().catch(() => {});
      await canal.send({
        embeds: payloadEmbeds,
        components: payloadComponents
      });
      if (!interaction.replied) await interaction.reply({
        content: "✅ Panel configurado.",
        ephemeral: true
      });
    } else {
      await interaction.reply({
        content: "⚠️ Canal no reconocido.",
        ephemeral: true
      });
    }
  } //--------------------------------------------------------------------
  // 2. VINCULACIÓN 
  // CLIC EN EL BOTÓN -> Solo abre el modal


  if (interaction.isButton() && interaction.customId === 'btn_abrir_vinculacion') {
    const modal = new ModalBuilder().setCustomId('modal_vincular_cuenta').setTitle('Identificación de Empleado');
    const inputNomina = new TextInputBuilder().setCustomId('input_nomina').setLabel("Tu Número de Nómina").setPlaceholder("Ej. 1234").setStyle(TextInputStyle.Short).setRequired(true);
    const row = new ActionRowBuilder().addComponents(inputNomina);
    modal.addComponents(row); // RESPUESTA ÚNICA: Mostrar Modal

    await interaction.showModal(modal);
  } // RECIBIR EL MODAL -> Procesa roles


  if (interaction.isModalSubmit() && interaction.customId === 'modal_vincular_cuenta') {
    await interaction.deferReply({
      ephemeral: true
    });
    const numeroEmpleado = interaction.fields.getTextInputValue('input_nomina');

    try {
      const employee = await Employee.findOne({
        numberEmployee: numeroEmpleado
      });
      if (!employee) return interaction.editReply(`❌ No encontré la nómina **${numeroEmpleado}**.`);
      if (employee.active === false) return interaction.editReply("❌ Empleado inactivo.");
      if (employee.discordId && employee.discordId !== interaction.user.id) return interaction.editReply("⚠️ Nómina ya vinculada.");
      employee.discordId = interaction.user.id;
      employee.discordUsername = interaction.user.tag;
      await employee.save(); // ASIGNACIÓN DE ROLES (Lógica Restaurada)

      const member = interaction.member;
      let rolesAsignados = []; // Rol Base: Empleado

      if (ROLE_EMPLEADO) {
        const r = interaction.guild.roles.cache.get(ROLE_EMPLEADO);

        if (r) {
          await member.roles.add(r).catch(console.error);
          rolesAsignados.push("Empleado");
        }
      } // Roles Sistema: Instructor / Enroller


      if (employee.user === true) {
        const webUser = await User.findOne({
          employee: employee._id
        });

        if (webUser) {
          const dbRoles = await Role.find({
            _id: {
              $in: webUser.roles
            }
          }); // Chequeo Instructor

          if (dbRoles.some(r => r.name === "admin" || r.name === "Instructor")) {
            if (ROLE_INSTRUCTOR) {
              const r = interaction.guild.roles.cache.get(ROLE_INSTRUCTOR);

              if (r) {
                await member.roles.add(r).catch(console.error);
                rolesAsignados.push("Instructor");
              }
            }
          } // Chequeo Enroller


          if (dbRoles.some(r => r.name === "Enroller" || r.name === "admin")) {
            if (ROLE_ENROLLER) {
              const r = interaction.guild.roles.cache.get(ROLE_ENROLLER);

              if (r) {
                await member.roles.add(r).catch(console.error);
                rolesAsignados.push("RRHH");
              }
            }
          }
        }
      }

      await interaction.editReply({
        content: `✅ **¡Vinculación Exitosa!**\nHola **${employee.name}**.\nRoles: ${rolesAsignados.join(', ')}`
      });
    } catch (error) {
      console.error(error);
      await interaction.editReply("❌ Error interno.");
    }
  } //--------------------------------------------------------------------
  // 3. COMANDOS DE ESTUDIANTE 
  // /MIS-CURSOS


  if (interaction.isChatInputCommand() && interaction.commandName === 'mis-cursos') {
    try {
      await interaction.deferReply({
        ephemeral: true
      });
      const emp = await Employee.findOne({
        discordId: interaction.user.id
      }).populate('enrolledCourses.courseId');
      if (!emp || !emp.active) return interaction.editReply("❌ No estás vinculado.");
      if (!emp.enrolledCourses || emp.enrolledCourses.length === 0) return interaction.editReply("📂 No tienes cursos inscritos.");
      const embed = new EmbedBuilder().setColor(0x0099FF).setTitle(`📊 Progreso de: ${emp.name}`).setDescription('Aquí tienes tu historial académico:').setTimestamp();
      let componentes = [];

      for (let [index, inscripcion] of emp.enrolledCourses.entries()) {
        if (!inscripcion.courseId) continue;
        const curso = inscripcion.courseId; // Reparación de datos

        if (isNaN(inscripcion.currentPhase)) inscripcion.currentPhase = 0;
        if (isNaN(inscripcion.progress)) inscripcion.progress = 0;
        const barra = generarBarra(inscripcion.progress);
        const estadoIcono = inscripcion.status === 'Completed' ? '✅' : '⏳';
        let detalles = `**Estado:** ${estadoIcono} ${inscripcion.status}\n**Avance:** \`${barra}\` ${inscripcion.progress}%`; // --- LÓGICA DE RESULTADOS (SOLO SI ESTÁ COMPLETADO) ---

        if (inscripcion.status === 'Completed') {
          // Buscar intentos de este curso y este usuario
          const intentos = await QuizAttempt.find({
            employeeDiscordId: interaction.user.id,
            courseId: curso._id,
            type: 'FINAL_EXAM' // Solo nos interesa el examen final para la nota global

          }).sort({
            attemptDate: 1
          }); // Ordenado por fecha

          if (intentos.length > 0) {
            const ultimoIntento = intentos[intentos.length - 1]; // El último

            const totalIntentos = intentos.length;
            detalles += `\n\n🏆 **Resultados Finales:**\n` + `• **Calificación:** ${ultimoIntento.score.toFixed(0)}/100\n` + `• **Intentos:** ${totalIntentos}\n` + `• **Fecha:** ${ultimoIntento.attemptDate.toLocaleDateString()}`;
          }
        } else {
          // Si no está completado, mostrar Fase
          detalles += `\n**Fase Actual:** ${inscripcion.currentPhase + 1}`;
        }

        embed.addFields({
          name: `${index + 1}. ${curso.title}`,
          value: detalles,
          inline: false
        }); // Botón Retomar (Solo si In Progress)

        if (inscripcion.status === 'In Progress') {
          let indiceRetomar = inscripcion.currentPhase - 1;
          componentes.push(new ButtonBuilder().setCustomId(`player_next_${curso._id}_${indiceRetomar}`).setLabel(`▶️ Retomar: ${curso.title.substring(0, 15)}`).setStyle(ButtonStyle.Primary));
        }
      }

      const row = componentes.length > 0 ? new ActionRowBuilder().addComponents(componentes.slice(0, 5)) : null;
      await interaction.editReply({
        embeds: [embed],
        components: row ? [row] : []
      });
    } catch (error) {
      console.error("Error mis-cursos:", error);
      if (!interaction.replied) await interaction.editReply("❌ Error al cargar historial.");
    }
  } // /VER-CURSOS


  if (interaction.isChatInputCommand() && interaction.commandName === 'ver-cursos') {
    try {
      const categorias = await Course.distinct('category', {
        isActive: true,
        isObsolete: false,
        isDisabled: false
      });

      if (!categorias || categorias.length === 0) {
        return interaction.reply({
          content: "📂 No hay categorías disponibles aún.",
          ephemeral: true
        });
      }

      const menuCategorias = new StringSelectMenuBuilder().setCustomId('menu_seleccionar_categoria') // ID Clave
      .setPlaceholder('📂 Selecciona un Departamento / Categoría').addOptions(categorias.map(cat => new StringSelectMenuOptionBuilder().setLabel(cat).setValue(cat).setEmoji('📁')));
      const row = new ActionRowBuilder().addComponents(menuCategorias);
      const embed = new EmbedBuilder().setTitle("📘 Catálogo de Cursos Axiom").setDescription("Para facilitar tu búsqueda, primero selecciona el área de interés:").setColor('Navy');
      await interaction.reply({
        embeds: [embed],
        components: [row],
        ephemeral: true
      });
    } catch (error) {
      console.error(error);
      await interaction.reply({
        content: "❌ Error cargando categorías.",
        ephemeral: true
      });
    }
  } // MANEJADOR: SELECCIÓN DE CATEGORÍA -> MOSTRAR CURSOS


  if (interaction.isStringSelectMenu() && interaction.customId === 'menu_seleccionar_categoria') {
    const categoriaSeleccionada = interaction.values[0];

    try {
      const cursosFiltrados = await Course.find({
        category: categoriaSeleccionada,
        isActive: true,
        isObsolete: false,
        isDisabled: false
      });

      if (cursosFiltrados.length === 0) {
        return interaction.update({
          content: `⚠️ No hay cursos activos en **${categoriaSeleccionada}**.`,
          components: []
        });
      }

      const menuCursos = new StringSelectMenuBuilder().setCustomId('menu_inscribir_curso').setPlaceholder(`📘 Cursos de ${categoriaSeleccionada}`).addOptions(cursosFiltrados.map(curso => new StringSelectMenuOptionBuilder().setLabel(curso.title).setDescription(`Duración aprox: ${curso.phases.length} lecciones`).setValue(curso._id.toString()).setEmoji('🎓')));
      const btnAtras = new ButtonBuilder().setCustomId('reset_categorias').setLabel('Volver a Categorías').setStyle(ButtonStyle.Secondary);
      const row = new ActionRowBuilder().addComponents(menuCursos);
      const embed = new EmbedBuilder().setTitle(`📂 Área: ${categoriaSeleccionada}`).setDescription(`Selecciona el curso al que deseas inscribirte:`).setColor('Blue');
      await interaction.update({
        embeds: [embed],
        components: [row]
      });
    } catch (error) {
      console.error(error);
      await interaction.update({
        content: "❌ Error cargando cursos.",
        components: []
      });
    }
  } // Inscribir Empleado


  if (interaction.isStringSelectMenu() && interaction.customId === 'menu_inscribir_curso') {
    const cursoId = interaction.values[0];

    try {
      const emp = await Employee.findOne({
        discordId: interaction.user.id
      });
      const cursoActivo = emp.enrolledCourses.find(c => c.status === 'In Progress');
      if (cursoActivo) return interaction.reply({
        content: `⚠️ Termina o cancela tu curso actual primero.`,
        ephemeral: true
      });
      emp.enrolledCourses.push({
        courseId: cursoId,
        currentPhase: 0,
        status: 'In Progress',
        progress: 0,
        enrolledAt: new Date()
      });
      await emp.save();
      await mostrarFaseReproductor(interaction, cursoId, 0);
    } catch (error) {
      console.error(error);
      interaction.reply({
        content: "Error al inscribir.",
        ephemeral: true
      });
    }
  } //NAVEGACIÓN REPRODUCTOR (CON MANEJO DE NaN)


  if (interaction.isButton() && (interaction.customId.startsWith('player_') || interaction.customId.startsWith('cancel_course_'))) {
    if (interaction.customId.startsWith('player_')) {
      const [_, accion, cursoId, idxStr] = interaction.customId.split('_');
      let idx = parseInt(idxStr);
      if (accion === 'next') idx++;
      if (accion === 'prev') idx--;
      if (idx < 0) idx = 0;
      await mostrarFaseReproductor(interaction, cursoId, idx);
    } else if (interaction.customId.startsWith('cancel_course_')) {
      const cursoId = interaction.customId.split('cancel_course_')[1];
      const emp = await Employee.findOne({
        discordId: interaction.user.id
      });
      const i = emp.enrolledCourses.findIndex(c => c.courseId.toString() === cursoId);

      if (i !== -1) {
        emp.enrolledCourses.splice(i, 1);
        await emp.save();
        await interaction.update({
          content: "🗑️ Curso cancelado.",
          embeds: [],
          components: []
        });
      }
    }
  } //--------------------------------------------------------------------
  // 4. GESTIÓN DE CURSOS
  // /CREAR-CURSO


  if (interaction.isChatInputCommand() && interaction.commandName === 'crear-curso') {
    const tienePermiso = await canCreateCourses(interaction.user.id);
    if (!tienePermiso) return interaction.reply({
      content: "⛔ Sin permisos.",
      ephemeral: true
    });
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
      await interaction.reply({
        content: "⏳ Iniciando panel de creación privado...",
        ephemeral: true,
        fetchReply: true
      });
      edicionSesion.set(interaction.user.id, {
        cursoId: nuevoCurso._id,
        modo: 'MENU',
        panelOriginal: interaction,
        tempQuiz: null
      });
      await actualizarPanelFisico(interaction, nuevoCurso._id);
    } catch (error) {
      console.error(error);
      if (!interaction.replied) interaction.reply({
        content: "Error creando borrador.",
        ephemeral: true
      });
    }
  } //MANEJO DE BOTONES DEL CREADOR (WIZARD)


  if (interaction.isButton() && interaction.customId.startsWith('btn_')) {
    if (interaction.customId === 'btn_abrir_vinculacion') return;
    const sesion = edicionSesion.get(interaction.user.id);
    if (!sesion) return interaction.reply({
      content: "⚠️ Sesión expirada.",
      ephemeral: true
    });

    if (interaction.customId === 'btn_add_video' || interaction.customId === 'btn_add_img') {
      sesion.modo = 'ESPERANDO_MEDIA';
      sesion.tempMediaType = interaction.customId === 'btn_add_video' ? 'TEXT_VIDEO' : 'TEXT_IMAGE';
      await interaction.reply({
        content: `📂 **SUBIR ARCHIVO**\nSube el archivo al chat ahora.`,
        ephemeral: true
      });
    }

    if (interaction.customId === 'btn_add_quiz' || interaction.customId === 'btn_add_final_exam') {
      const esFinal = interaction.customId === 'btn_add_final_exam';
      sesion.modo = 'CREANDO_QUIZ';
      sesion.tempQuiz = {
        preguntas: [],
        titulo: esFinal ? 'Examen Final' : 'Quiz Intermedio',
        esExamenFinal: esFinal,
        step: 0
      };
      await interaction.reply({
        content: `📝 **CREANDO EVALUACIÓN**\nEscribe las preguntas en el chat.`,
        ephemeral: true
      });
    }

    if (interaction.customId === 'btn_publicar') {
      const curso = await Course.findById(sesion.cursoId);
      if (!curso.finalExamId) return interaction.reply({
        content: "❌ Falta el Examen Final.",
        ephemeral: true
      });
      curso.isActive = true;
      await curso.save();
      edicionSesion.delete(interaction.user.id);
      await interaction.update({
        content: `✅ **¡CURSO PUBLICADO!**`,
        components: [],
        embeds: []
      });
    }
  } // ---------------------------------------------------------------------
  // 5. ASIGNACIÓN DE CURSOS


  if (interaction.isChatInputCommand() && interaction.commandName === 'asignar-curso') {
    const tienePermiso = await canCreateCourses(interaction.user.id);
    if (!tienePermiso) return interaction.reply({
      content: "⛔ Acceso denegado.",
      ephemeral: true
    });
    const numEmpleado = interaction.options.getString('numero_empleado');

    try {
      // 1. Validar que el empleado exista
      const emp = await Employee.findOne({
        numberEmployee: numEmpleado
      });

      if (!emp) {
        return interaction.reply({
          content: `❌ No encontré ningún empleado con la nómina **${numEmpleado}**.`,
          ephemeral: true
        });
      } // 2. Buscar Categorías disponibles


      const categorias = await Course.distinct('category', {
        isActive: true,
        isObsolete: false,
        isDisabled: false
      });

      if (categorias.length === 0) {
        return interaction.reply({
          content: "⚠️ No hay cursos activos disponibles para asignar.",
          ephemeral: true
        });
      } // 3. Crear Menú de Categorías


      const menuCategorias = new StringSelectMenuBuilder().setCustomId(`admin_assign_cat_${emp._id}`).setPlaceholder('📂 Selecciona el Área / Departamento').addOptions(categorias.map(cat => new StringSelectMenuOptionBuilder().setLabel(cat).setValue(cat).setEmoji('📁')));
      const row = new ActionRowBuilder().addComponents(menuCategorias);
      const embed = new EmbedBuilder().setTitle(`👤 Asignando curso a: ${emp.name} ${emp.lastName}`).setDescription(`Nómina: **${emp.numberEmployee}**\n\nSelecciona la categoría del curso que deseas asignarle:`).setColor('Gold').setThumbnail(interaction.user.displayAvatarURL()); // O foto del empleado si tienes

      await interaction.reply({
        embeds: [embed],
        components: [row],
        ephemeral: true
      });
    } catch (error) {
      console.error(error);
      await interaction.reply({
        content: "❌ Error interno buscando empleado.",
        ephemeral: true
      });
    }
  } // MANEJADOR: ASIGNAR - SELECCIÓN DE CATEGORÍA


  if (interaction.isStringSelectMenu() && interaction.customId.startsWith('admin_assign_cat_')) {
    const empId = interaction.customId.split('_')[3];
    const categoriaSeleccionada = interaction.values[0];

    try {
      // 1. Buscar cursos de esa categoría
      const cursosFiltrados = await Course.find({
        category: categoriaSeleccionada,
        isActive: true,
        isObsolete: false,
        isDisabled: false
      });

      if (cursosFiltrados.length === 0) {
        return interaction.update({
          content: `⚠️ No hay cursos activos en **${categoriaSeleccionada}**.`,
          components: [],
          embeds: []
        });
      } // 2. Crear Menú de Cursos


      const menuCursos = new StringSelectMenuBuilder().setCustomId(`admin_assign_final_${empId}`).setPlaceholder(`📘 Cursos disponibles en ${categoriaSeleccionada}`).addOptions(cursosFiltrados.map(curso => new StringSelectMenuOptionBuilder().setLabel(curso.title.substring(0, 100)).setDescription(`v${curso.version || 1} | ID: ${curso._id.toString().substring(0, 10)}...`) // Info técnica útil para admin
      .setValue(curso._id.toString()).setEmoji('🎓')));
      const row = new ActionRowBuilder().addComponents(menuCursos);
      const embed = new EmbedBuilder().setTitle(`📂 Categoría: ${categoriaSeleccionada}`).setDescription("Ahora selecciona el curso específico para inscribir al colaborador:").setColor('Blue');
      await interaction.update({
        embeds: [embed],
        components: [row]
      });
    } catch (error) {
      console.error(error);
      await interaction.update({
        content: "❌ Error cargando cursos.",
        components: []
      });
    }
  } // MANEJADOR: ASIGNAR - EJECUCIÓN FINAL (Inscripción)


  if (interaction.isStringSelectMenu() && interaction.customId.startsWith('admin_assign_final_')) {
    const empId = interaction.customId.split('_')[3];
    const cursoId = interaction.values[0];
    await interaction.deferUpdate();

    try {
      const emp = await Employee.findById(empId);
      const curso = await Course.findById(cursoId);

      if (!emp || !curso) {
        return interaction.editReply({
          content: "❌ Error: Empleado o Curso ya no existen.",
          components: [],
          embeds: []
        });
      } // 1. Verificar si ya lo tiene (Activo o Completado)


      const yaInscrito = emp.enrolledCourses.find(c => c.courseId.toString() === cursoId);

      if (yaInscrito) {
        return interaction.editReply({
          content: `⚠️ **Aviso:** El empleado **${emp.name} ${emp.lastName}** ya está inscrito en "${curso.title}" (Estado: ${yaInscrito.status}). No se duplicó.`,
          components: [],
          embeds: []
        });
      } // 2. Inscribir


      emp.enrolledCourses.push({
        courseId: curso._id,
        status: 'In Progress',
        progress: 0,
        currentPhase: 0,
        enrolledAt: new Date()
      });
      await emp.save(); // 3. Confirmación al Admin

      await interaction.editReply({
        content: `✅ **¡Asignación Exitosa!**\n\n👤 **Empleado:** ${emp.name} ${emp.lastName}\n📘 **Curso:** ${curso.title}\n📅 **Fecha:** ${new Date().toLocaleDateString('es-MX')}`,
        components: [],
        embeds: []
      }); // 4. Notificación al Empleado (DM)

      if (emp.discordId) {
        try {
          const usuarioDiscord = await client.users.fetch(emp.discordId);
          const embedDM = new EmbedBuilder().setTitle("🚨 Nueva Asignación de Curso") // Título original en Rojo
          .setDescription(`Hola **${emp.name}**,\n\nEl area de Capacitación te ha asignado un nuevo curso obligatorio.`).addFields({
            name: '📘 Curso',
            value: curso.title
          }, {
            name: '📅 Fecha',
            value: new Date().toLocaleDateString('es-MX')
          }).setColor('Red') // Volvemos al rojo de alerta
          .setFooter({
            text: 'Usa el comando /mis-cursos en el canal #mi-aula para comenzar.'
          }); // 🔥 Instrucción agregada

          await usuarioDiscord.send({
            embeds: [embedDM]
          });
        } catch (e) {
          console.log(`No se pudo enviar DM a ${emp.name} (Privados cerrados).`);
        }
      }
    } catch (error) {
      console.error(error);
      await interaction.editReply({
        content: "❌ Error crítico al inscribir.",
        components: []
      });
    }
  } // ---------------------------------------------------------------------
  // 6. EXÁMENES


  if (interaction.isButton() && (interaction.customId.startsWith('start_quiz_') || interaction.customId.startsWith('start_exam_'))) {
    const [tipo, _x, quizId] = interaction.customId.split('_');

    try {
      const quiz = await Quiz.findById(quizId);
      if (!quiz) return interaction.reply({
        content: "Error: Examen no encontrado.",
        ephemeral: true
      });
      tomaQuizSesion.set(interaction.user.id, {
        quizId: quizId,
        preguntas: quiz.questions,
        indicePregunta: 0,
        aciertos: 0,
        respuestasUsuario: [],
        esExamenFinal: tipo === 'start' && interaction.customId.includes('exam')
      });
      await mostrarPreguntaExamen(interaction);
    } catch (error) {
      console.error(error);
    }
  }

  if (interaction.isStringSelectMenu() && interaction.customId === 'quiz_responder') {
    const sesion = tomaQuizSesion.get(interaction.user.id);
    if (!sesion) return interaction.reply({
      content: "Sesión expirada.",
      ephemeral: true
    });
    const respuestaElegida = parseInt(interaction.values[0]);
    const preguntaActual = sesion.preguntas[sesion.indicePregunta];
    sesion.respuestasUsuario.push(respuestaElegida);
    if (respuestaElegida === preguntaActual.correctIndex) sesion.aciertos++;
    sesion.indicePregunta++;
    if (sesion.indicePregunta >= sesion.preguntas.length) await finalizarExamen(interaction, sesion);else await mostrarPreguntaExamen(interaction);
  } // ---------------------------------------------------------------------
  // 7. REPORTES / ADMIN


  if (interaction.isChatInputCommand() && interaction.commandName === 'admin-reporte') {
    const tienePermiso = await canCreateCourses(interaction.user.id);
    if (!tienePermiso) return interaction.reply({
      content: "⛔ Solo Instructores.",
      ephemeral: true
    }); // Buscar todos los cursos activos

    const cursos = await Course.find({
      isActive: true
    });
    if (cursos.length === 0) return interaction.reply({
      content: "❌ No hay cursos activos.",
      ephemeral: true
    });
    const menu = new StringSelectMenuBuilder().setCustomId('reporte_seleccionar_curso').setPlaceholder('Selecciona un curso para auditar...');
    cursos.forEach(c => {
      menu.addOptions(new StringSelectMenuOptionBuilder().setLabel(c.title.substring(0, 100)).setDescription(`Categoría: ${c.category}`).setValue(c._id.toString()).setEmoji('📊'));
    });
    await interaction.reply({
      content: "📊 **Centro de Reportes**\nSelecciona el curso del cual deseas ver el estado de los empleados:",
      components: [new ActionRowBuilder().addComponents(menu)],
      ephemeral: true
    });
  } // GENERAR REPORTE + EXCEL (Al seleccionar curso)


  if (interaction.isStringSelectMenu() && interaction.customId === 'reporte_seleccionar_curso') {
    const cursoId = interaction.values[0];
    await interaction.update({
      content: "⏳ Generando reporte y analizando datos...",
      components: []
    });

    try {
      const curso = await Course.findById(cursoId);
      const empleadosInscritos = await Employee.find({
        'enrolledCourses.courseId': curso._id
      });

      if (empleadosInscritos.length === 0) {
        return interaction.editReply(`📂 El curso **${curso.title}** no tiene alumnos.`);
      }

      let dataExcel = [];
      let textoVisual = "";
      let completados = 0;
      let enProgreso = 0;

      for (const emp of empleadosInscritos) {
        const inscripcion = emp.enrolledCourses.find(c => c.courseId.toString() === cursoId);
        if (!inscripcion) continue; // Datos básicos

        let estado = inscripcion.status === 'Completed' ? 'Completado' : 'En Progreso';
        let notaFinal = "N/A";
        let intentos = 0; // Si terminó, buscamos su nota real en QuizAttempt

        if (inscripcion.status === 'Completed') {
          completados++;
          const historial = await QuizAttempt.find({
            employeeDiscordId: emp.discordId,
            courseId: curso._id,
            type: 'FINAL_EXAM'
          }).sort({
            attemptDate: 1
          });

          if (historial.length > 0) {
            const ultimo = historial[historial.length - 1];
            notaFinal = ultimo.score.toFixed(0);
            intentos = historial.length;
          }

          textoVisual += `✅ **${emp.name} ${emp.lastName}** - 100% (Nota: ${notaFinal})\n`;
        } else {
          enProgreso++;
          textoVisual += `⏳ **${emp.name} ${emp.lastName}** - ${inscripcion.progress || 0}% (Fase ${inscripcion.currentPhase + 1})\n`;
        } // Fila para Excel


        dataExcel.push({
          "Número Nómina": emp.numberEmployee,
          "Nombre": emp.name + " " + emp.lastName,
          "Estado": estado,
          "Progreso (%)": inscripcion.progress || 0,
          "Nota Final": notaFinal,
          "Intentos Examen": intentos,
          "Fecha Inscripción": inscripcion.enrolledAt ? inscripcion.enrolledAt.toLocaleDateString() : "N/A",
          "Fecha Finalizacion": inscripcion.completedAt ? inscripcion.completedAt.toLocaleDateString() : "-"
        });
      }

      if (textoVisual.length > 2000) textoVisual = textoVisual.substring(0, 2000) + "\n...(descarga el Excel para ver todo)";
      if (textoVisual === "") textoVisual = "Sin datos."; // --- GENERAR ARCHIVO EXCEL EN MEMORIA ---

      const workbook = XLSX.utils.book_new();
      const worksheet = XLSX.utils.json_to_sheet(dataExcel);
      XLSX.utils.book_append_sheet(workbook, worksheet, "Reporte"); // Crear buffer

      const buffer = XLSX.write(workbook, {
        type: "buffer",
        bookType: "xlsx"
      });
      const archivoAdjunto = new AttachmentBuilder(buffer, {
        name: `Reporte_${curso.title.replace(/ /g, "_")}.xlsx`
      }); // --- RESPONDER ---

      const total = completados + enProgreso;
      const porcentaje = Math.round(completados / total * 100);
      const barra = generarBarra(porcentaje);
      const embed = new EmbedBuilder().setTitle(`📊 Reporte: ${curso.title}`).setDescription(`**Resumen:**\n` + `👥 Total Alumnos: **${total}**\n` + `🎓 Graduados: **${completados}**\n` + `🏃 En Curso: **${enProgreso}**\n` + `📈 Eficiencia: \`${barra}\` ${porcentaje}%`).addFields({
        name: '📋 Lista Rápida',
        value: textoVisual
      }).setColor('Green').setFooter({
        text: 'El archivo Excel adjunto contiene todos los detalles.'
      });
      await interaction.editReply({
        content: "✅ **Reporte Generado Exitosamente**",
        embeds: [embed],
        files: [archivoAdjunto]
      });
    } catch (error) {
      console.error(error);
      await interaction.editReply("❌ Error generando reporte.");
    }
  } // ---------------------------------------------------------------------
  // 7. /AYUDA (Manual de Usuario Inteligente)


  if (interaction.isChatInputCommand() && interaction.commandName === 'ayuda') {
    const esStaff = await canCreateCourses(interaction.user.id);
    const embed = new EmbedBuilder().setTitle("🤖 Centro de Ayuda | AxiomPaperless Academy").setDescription("Aquí tienes la lista de comandos disponibles según tu perfil:").setColor(esStaff ? 'Gold' : 'Blue') // Dorado para Jefes, Azul para Alumnos
    .setThumbnail(client.user.displayAvatarURL()).setFooter({
      text: 'Sistema LMS v2.0'
    }); // --- SECCIÓN 1: COMANDOS PARA TODOS (ESTUDIANTES) ---

    let textoEstudiante = "`/vincular [numero]`\n👉 **Paso 1:** Conecta tu usuario de Discord con tu nómina para acceder.\n\n" + "`/ver-cursos`\n👉 **Catálogo:** Muestra el menú para inscribirte en nuevos cursos.\n\n" + "`/mis-cursos`\n👉 **Mi Aula:** Muestra tu progreso, calificaciones y te permite retomar clases.";
    embed.addFields({
      name: '🎓 Comandos de Estudiante',
      value: textoEstudiante
    }); // --- SECCIÓN 2: COMANDOS SOLO PARA STAFF (INSTRUCTORES / ENROLLERS) ---

    if (esStaff) {
      let textoStaff = "**🛠️ Gestión de Cursos**\n" + "`/crear-curso` Crea un curso nuevo desde cero.\n" + "`/actualizar-curso` 🆕 Crea una versión v2, v3... (Mantiene historial).\n" + "`/deshabilitar-curso` 🚫 Oculta un curso y notifica al creador.\n" + "`/auditar-curso` 🕵️ Muestra respuestas correctas y contenido.\n\n" + "**📜 Certificaciones**\n" + "`/buscar-certificado` 🎓 Recupera un diploma y permite reenviarlo.\n" + "`/test-certificado` 🎨 Genera un PDF de prueba para calibrar diseño.\n\n" + "**📊 Administración**\n" + "`/asignar-curso` Inscribe manualmente a un alumno.\n" + "`/admin-reporte` Descarga el Excel de calificaciones.\n" + "`/setup-bienvenida` Restaura los paneles gráficos de los canales.";
      embed.addFields({
        name: '🛠️ Panel de Control (Staff)',
        value: textoStaff
      });
    }

    await interaction.reply({
      embeds: [embed],
      ephemeral: true
    });
  } // ---------------------------------------------------------------------
  // 8. /BUSCAR-CERTIFICADO (Recuperar y Reenviar)


  if (interaction.isChatInputCommand() && interaction.commandName === 'buscar-certificado') {
    const tienePermiso = await canCreateCourses(interaction.user.id); // O verifica rol Enroller

    if (!tienePermiso) return interaction.reply({
      content: "⛔ Solo Staff.",
      ephemeral: true
    });
    const numEmpleado = interaction.options.getString('numero_empleado');
    const busquedaCurso = interaction.options.getString('nombre_curso');
    await interaction.deferReply({
      ephemeral: true
    }); // Solo el Enroller ve esto para no llenar el chat

    try {
      const emp = await Employee.findOne({
        numberEmployee: numEmpleado
      }).populate('enrolledCourses.courseId');
      if (!emp) return interaction.editReply("❌ Empleado no encontrado.");
      const inscripcion = emp.enrolledCourses.find(c => c.status === 'Completed' && c.courseId.title.toLowerCase().includes(busquedaCurso.toLowerCase()));
      if (!inscripcion) return interaction.editReply("❌ Curso completado no encontrado."); // Recuperar fecha original o usar actual

      let fechaFormat;

      if (inscripcion.completedAt) {
        fechaFormat = new Date(inscripcion.completedAt).toLocaleDateString('es-MX', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric'
        }).replace(/\//g, '-');
      } else {
        fechaFormat = new Date().toLocaleDateString('es-MX').replace(/\//g, '-');
      } // Regenerar PDF


      const bufferPDF = await crearPDFCertificado(emp.name + " " + emp.lastName, inscripcion.courseId.title, fechaFormat);
      const adjunto = new AttachmentBuilder(bufferPDF, {
        name: `Copia_${emp.numberEmployee}.pdf`
      }); // CREAR BOTÓN DE REENVÍO

      const row = new ActionRowBuilder().addComponents(new ButtonBuilder().setCustomId(`reenviar_cert_${emp._id}_${inscripcion.courseId._id}`).setLabel('📧 Reenviar al Empleado').setStyle(ButtonStyle.Primary).setEmoji('📨'));
      await interaction.editReply({
        content: `📂 **Archivo Recuperado**\nEmpleado: ${emp.name} ${emp.lastName}\nCurso: ${inscripcion.courseId.title}\n\n¿Deseas enviarle una copia fresca al empleado?`,
        files: [adjunto],
        components: [row]
      });
    } catch (e) {
      console.error(e);
      await interaction.editReply("❌ Error al buscar certificado.");
    }
  } // MANEJADOR DE BOTÓN: REENVIAR CERTIFICADO


  if (interaction.isButton() && interaction.customId.startsWith('reenviar_cert_')) {
    const [_, _x, empId, courseId] = interaction.customId.split('_');
    await interaction.deferReply({
      ephemeral: true
    });

    try {
      const emp = await Employee.findById(empId);
      const curso = await Course.findById(courseId); // Buscamos la fecha real de terminación

      const inscripcion = emp.enrolledCourses.find(c => c.courseId.toString() === courseId);

      if (!emp || !curso || !emp.discordId) {
        return interaction.editReply("❌ No se pudo contactar al empleado (¿Está vinculado?).");
      } // Regeneramos PDF


      const bufferPDF = await crearPDFCertificado(emp.name + " " + emp.lastName, curso.title, inscripcion.completedAt ? inscripcion.completedAt.toLocaleDateString('es-MX') : new Date().toLocaleDateString('es-MX'));
      const adjunto = new AttachmentBuilder(bufferPDF, {
        name: `Diploma_${emp.numberEmployee}_${curso.title}.pdf`
      }); // Enviamos DM

      const usuarioDiscord = await client.users.fetch(emp.discordId);
      await usuarioDiscord.send({
        content: `👋 **Hola ${emp.name}**\n\nEl departamento de Recursos Humanos te ha reenviado tu certificado del curso: **${curso.title}**.\nAquí tienes tu copia.`,
        files: [adjunto]
      });
      await interaction.editReply(`✅ **¡Enviado!** Se le mandó el mensaje privado a ${emp.name} ${emp.lastName}.`);
    } catch (e) {
      console.error(e);
      await interaction.editReply("❌ Error al reenviar.");
    }
  } // ---------------------------------------------------------------------
  // 9. /TEST-CERTIFICADO (Calibración de Diseño)


  if (interaction.isChatInputCommand() && interaction.commandName === 'test-certificado') {
    // Verificamos permisos (Admin, Instructor, Enroller)
    const tienePermiso = await canCreateCourses(interaction.user.id);
    if (!tienePermiso) return interaction.reply({
      content: "⛔ Solo personal de Staff.",
      ephemeral: true
    }); // Obtener datos (o usar valores por defecto para prueba rápida)

    const nombreFake = interaction.options.getString('nombre_prueba') || "Fabian Ramos Flores";
    const cursoFake = interaction.options.getString('curso_prueba') || "Programa de Sugerencias APG Mexico"; // Generamos fecha de hoy formato DD-MM-YYYY

    const fechaFake = new Date().toLocaleDateString('es-MX', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).replace(/\//g, '-');
    await interaction.deferReply({
      ephemeral: true
    }); // Mensaje solo para ti

    try {
      const bufferPDF = await crearPDFCertificado(nombreFake, cursoFake, fechaFake);
      const archivoAdjunto = new AttachmentBuilder(bufferPDF, {
        name: `Prueba_Diseño.pdf`
      }); // Entregar resultado

      await interaction.editReply({
        content: `🎨 **Prueba de Diseño Generada**\n\n**Datos Simulados:**\n👤 **Nombre:** ${nombreFake}\n📘 **Curso:** ${cursoFake}\n📅 **Fecha:** ${fechaFake}\n\n👇 *Revisa el archivo adjunto. Si el texto está movido, ajusta las coordenadas X/Y en la función ` + "`crearPDFCertificado`.*",
        files: [archivoAdjunto]
      });
    } catch (error) {
      console.error("Error en test de diseño:", error);
      await interaction.editReply(`❌ **Error Técnico:**\n${error.message}\n\n*Verifica que los archivos .ttf y .pdf existan en src/assets*`);
    }
  } // ---------------------------------------------------------------------
  // 10. /ACTUALIZAR-CURSO (Versionado)


  if (interaction.isChatInputCommand() && interaction.commandName === 'actualizar-curso') {
    const tienePermiso = await canCreateCourses(interaction.user.id);
    if (!tienePermiso) return interaction.reply({
      content: "⛔ Solo Instructores.",
      ephemeral: true
    });
    const cursoId = interaction.options.getString('curso_id');

    try {
      const cursoViejo = await Course.findById(cursoId);
      if (!cursoViejo) return interaction.reply({
        content: "❌ Curso no encontrado.",
        ephemeral: true
      }); // 1. Marcar viejo como OBSOLETO

      cursoViejo.isObsolete = true;
      await cursoViejo.save(); // 2. Calcular nueva versión

      const nuevaVersion = (cursoViejo.version || 1) + 1; // Limpia el título anterior para no tener "Curso v1 v2 v3"

      const tituloBase = cursoViejo.title.replace(/ v\d+$/, '');
      const nuevoTitulo = `${tituloBase} v${nuevaVersion}`; // 3. Crear el NUEVO curso

      const nuevoCurso = new Course({
        title: nuevoTitulo,
        category: cursoViejo.category,
        phases: [],
        // Empieza vacío para subir contenido actualizado
        version: nuevaVersion,
        originalCourseId: cursoViejo._id,
        // ✅ USANDO TUS CAMPOS:
        createdByDiscordId: interaction.user.id,
        isActive: false,
        // Empieza inactivo hasta que termines de subir el contenido
        isDisabled: false,
        isObsolete: false
      });
      await nuevoCurso.save(); // 4. Iniciar modo edición (Seteamos el estado del usuario)

      userState.set(interaction.user.id, {
        step: 'WAITING_PHASE_TYPE',
        courseId: nuevoCurso._id,
        phaseIndex: 0
      });
      await interaction.reply({
        content: `🔄 **Nueva Versión Creada: v${nuevaVersion}**\n\nEl curso anterior ha quedado como *Obsoleto*.\nEstás editando: **${nuevoTitulo}**.\n\n👇 **¡Sube el contenido actualizado!** (Usa los botones o comandos)`
      });
    } catch (error) {
      console.error(error);
      interaction.reply("❌ Error al versionar.");
    }
  } // ---------------------------------------------------------------------
  // 11. /DESHABILITAR-CURSO (Enroller)


  if (interaction.isChatInputCommand() && interaction.commandName === 'deshabilitar-curso') {
    const tienePermiso = await canCreateCourses(interaction.user.id);
    if (!tienePermiso) return interaction.reply("⛔ Acceso denegado.");
    const cursoId = interaction.options.getString('curso_id');
    const motivo = interaction.options.getString('motivo');

    try {
      const curso = await Course.findById(cursoId);
      if (!curso) return interaction.reply("❌ Curso no existe."); // Bloquear

      curso.isDisabled = true;
      curso.isActive = false;
      await curso.save();
      let aviso = `🚫 Curso **"${curso.title}"** ha sido deshabilitado.`; // Notificar usando TU CAMPO: createdByDiscordId

      if (curso.createdByDiscordId) {
        try {
          const creador = await client.users.fetch(curso.createdByDiscordId);
          const embedDM = new EmbedBuilder().setTitle("⚠️ Curso Rechazado / Deshabilitado").setDescription(`El departamento de Calidad ha retirado tu curso **"${curso.title}"**.`).addFields({
            name: '📝 Motivo',
            value: motivo
          }).setColor('Red');
          await creador.send({
            embeds: [embedDM]
          });
          aviso += "\n📩 Notificación enviada al instructor.";
        } catch (e) {
          aviso += "\n⚠️ No se pudo enviar DM (Privados cerrados).";
        }
      }

      await interaction.reply(aviso);
    } catch (error) {
      console.error(error);
      interaction.reply("❌ Error técnico.");
    }
  } // ---------------------------------------------------------------------
  // 12. /LINK-ACCESO (Generador de Invitaciones Seguro)


  if (interaction.isChatInputCommand() && interaction.commandName === 'link-acceso') {
    const tienePermiso = await canCreateCourses(interaction.user.id);
    if (!tienePermiso) return interaction.reply({
      content: "⛔ Solo personal de RRHH.",
      ephemeral: true
    });
    await interaction.deferReply({
      ephemeral: true
    });

    try {
      // 2. Buscar el canal CORRECTO (#vincular-cuenta)
      // Buscamos por nombre parcial para asegurar que le atinamos
      const canalVincular = interaction.guild.channels.cache.find(c => c.name.includes('vincular') && c.type === 0 // Tipo 0 es Texto
      );

      if (!canalVincular) {
        return interaction.editReply("❌ Error crítico: No encuentro el canal `#vincular-cuenta`. Asegúrate de que existe.");
      } // 3. Crear (o recuperar) la invitación
      // maxAge: 0 (Nunca expira)
      // maxUses: 0 (Usos infinitos)
      // unique: false (Si ya existe una igual, devuélvela, no crees basura extra)


      const invitacion = await canalVincular.createInvite({
        maxAge: 0,
        maxUses: 0,
        unique: false,
        reason: `Generado por ${interaction.user.tag} para onboarding`
      }); // 4. Entregar el Paquete Listo para Copiar

      const mensajeParaCopiar = `Hola, bienvenido a Axiom Paperless Academy.\n\nPara iniciar tu capacitación, únete a nuestro servidor oficial aquí:\n${invitacion.url}\n\n*Recuerda tener tu número de nómina a la mano.*`;
      const embed = new EmbedBuilder().setTitle("🎟️ Enlace de Acceso Oficial").setDescription(`Este enlace redirige **directamente** al canal ${canalVincular.toString()}.`).addFields({
        name: '🔗 Link Directo',
        value: invitacion.url
      }, {
        name: '📋 Plantilla para WhatsApp/Correo',
        value: `\`\`\`\n${mensajeParaCopiar}\n\`\`\``
      }).setColor('Green').setFooter({
        text: 'Este enlace NO caduca. Puedes usarlo siempre.'
      });
      await interaction.editReply({
        embeds: [embed]
      });
    } catch (error) {
      console.error(error);
      await interaction.editReply("❌ Error generando la invitación (Revisa permisos del Bot 'Crear Invitación').");
    }
  } // ---------------------------------------------------------------------
  // --- 🛡️ GUARDIA DE TRÁFICO (Permisos por Canal) ---


  if (interaction.isChatInputCommand()) {
    const canal = interaction.channel.name.toLowerCase();
    const comando = interaction.commandName; // 1. RECEPCIÓN: Solo vincular
    // if (canal.includes('vincular')) {
    //     if (comando !== 'vincular' && comando !== 'setup-bienvenida') {
    //         return interaction.reply({ content: "🔒 Aquí solo puedes usar `/vincular`.", ephemeral: true });
    //     }
    // }
    // 2. AULAS: Solo comandos de estudiante
    // (Admin Supremo, Instructor y Empleado pueden estudiar aquí)
    // Bloqueamos comandos de gestión para que no creen cursos en el salón de clases

    const comandosGestion = ['crear-curso', 'asignar-curso', 'admin-reporte'];

    if ((canal.includes('aula') || canal.includes('catalogo')) && comandosGestion.includes(comando)) {
      return interaction.reply({
        content: "⛔ Los comandos de gestión van en la categoría de **Gestión**.",
        ephemeral: true
      });
    } // 3. GESTIÓN:
    // - Instructor usa /crear-curso en #creador
    // - Enroller usa /admin-reporte en #control


    if (canal.includes('control') && comando === 'crear-curso') {
      return interaction.reply({
        content: "⚠️ Crea los cursos en el canal `#creador-de-cursos`.",
        ephemeral: true
      });
    }
  } // ---------------------------------------------------------------------
  // COMANDO: /REVINCULAR (Sincronización de Roles BD <-> Discord)


  if (interaction.isChatInputCommand() && interaction.commandName === 'revincular') {
    // 1. Verificación de seguridad (Solo Staff puede usar esto)
    const tienePermiso = await canCreateCourses(interaction.user.id);
    if (!tienePermiso) return interaction.reply({
      content: "⛔ No tienes permisos para gestionar roles.",
      ephemeral: true
    });
    const nomina = interaction.options.getString('numero_empleado');
    await interaction.deferReply({
      ephemeral: true
    });

    try {
      // 2. Buscar datos completos en Base de Datos
      const employee = await Employee.findOne({
        numberEmployee: nomina
      });

      if (!employee) {
        return interaction.editReply(`❌ No existe el empleado con nómina **${nomina}**.`);
      }

      if (!employee.discordId) {
        return interaction.editReply(`⚠️ El empleado **${employee.name}** existe, pero **NO tiene una cuenta de Discord vinculada**.\nPídele que se vincule primero.`);
      } // 3. Obtener el Miembro en Discord


      let member;

      try {
        member = await interaction.guild.members.fetch(employee.discordId);
      } catch (e) {
        return interaction.editReply(`❌ El empleado tiene un ID vinculado, pero **ya no está en el servidor** de Discord.`);
      } // 4. Analizar Roles en MONGODB


      let debeSerInstructor = false;
      let debeSerEnroller = false;

      if (employee.user === true) {
        const webUser = await User.findOne({
          employee: employee._id
        });

        if (webUser) {
          const dbRoles = await Role.find({
            _id: {
              $in: webUser.roles
            }
          }); // Checamos si en la BD tiene estos permisos

          debeSerInstructor = dbRoles.some(r => r.name === "admin" || r.name === "Instructor");
          debeSerEnroller = dbRoles.some(r => r.name === "Enroller" || r.name === "RH" || r.name === "Recursos Humanos");
        }
      } // 5. EJECUTAR SINCRONIZACIÓN (Add vs Remove)


      const logCambios = []; // --- A. Rol de INSTRUCTOR ---

      const rolInstID = process.env.ROLE_ID_INSTRUCTOR;

      if (rolInstID) {
        if (debeSerInstructor) {
          if (!member.roles.cache.has(rolInstID)) {
            await member.roles.add(rolInstID);
            logCambios.push("✅ **Instructor:** Rol Agregado");
          }
        } else {
          if (member.roles.cache.has(rolInstID)) {
            await member.roles.remove(rolInstID);
            logCambios.push("🔻 **Instructor:** Rol Quitado (Ya no tiene permiso en BD)");
          }
        }
      } // --- B. Rol de ENROLLER (RH) ---


      const rolEnrollerID = process.env.ROLE_ID_ENROLLER;

      if (rolEnrollerID) {
        if (debeSerEnroller) {
          if (!member.roles.cache.has(rolEnrollerID)) {
            await member.roles.add(rolEnrollerID);
            logCambios.push("✅ **Enroller:** Rol Agregado");
          }
        } else {
          if (member.roles.cache.has(rolEnrollerID)) {
            await member.roles.remove(rolEnrollerID);
            logCambios.push("🔻 **Enroller:** Rol Quitado (Ya no tiene permiso en BD)");
          }
        }
      } // --- C. Rol de EMPLEADO (Siempre debe tenerlo si está activo) ---


      const rolEmpID = process.env.ROLE_ID_EMPLEADO;

      if (rolEmpID && !member.roles.cache.has(rolEmpID)) {
        await member.roles.add(rolEmpID);
        logCambios.push("✅ **Empleado:** Rol Restaurado");
      } // 6. Reporte Final


      if (logCambios.length === 0) {
        await interaction.editReply(`✨ **Todo en orden.**\nLos roles de **${employee.name}** en Discord ya coinciden perfectamente con la Base de Datos.`);
      } else {
        const embed = new EmbedBuilder().setTitle("🔄 Sincronización Completada").setDescription(`Se actualizaron los permisos de **${employee.name} ${employee.lastName}**.`).addFields({
          name: 'Cambios Realizados',
          value: logCambios.join('\n')
        }).setColor('Blue');
        await interaction.editReply({
          embeds: [embed]
        }); // Opcional: Avisar al usuario por DM de que sus permisos cambiaron

        try {
          await member.send(`🔄 **Tus permisos han sido actualizados.**\nEl administrador ha sincronizado tu perfil con la base de datos.\nCambios: ${logCambios.join(', ')}`);
        } catch (e) {}
      }
    } catch (error) {
      console.error(error);
      await interaction.editReply("❌ Error interno al revincular.");
    }
  }
}); // =========================================================================
//  EVENTO MENSAJES (CREACIÓN)

client.on('messageCreate', async message => {
  if (message.author.bot) return;
  const sesion = edicionSesion.get(message.author.id);
  if (!sesion) return;

  if (sesion.modo === 'ESPERANDO_MEDIA') {
    const adjunto = message.attachments.first();

    if (!adjunto) {
      try {
        await message.delete();
      } catch (e) {}

      return enviarTemp(message.channel, "⚠️ Debes adjuntar un archivo (Imagen/Video).", 5);
    }

    try {
      const tempMsg = await message.channel.send("⏳ Procesando archivo...");
      const s3Result = await uploadToS3FromUrl(adjunto.url, adjunto.contentType);

      try {
        await message.delete();
      } catch (e) {}

      try {
        await tempMsg.delete();
      } catch (e) {}

      const curso = await Course.findById(sesion.cursoId);
      curso.phases.push({
        order: curso.phases.length + 1,
        title: `Fase Multimedia ${curso.phases.length + 1}`,
        type: 'MEDIA',
        mediaUrl: s3Result.url,
        textContent: message.content || "Sin descripción"
      });
      await curso.save();
      sesion.modo = 'MENU';
      enviarTemp(message.channel, "✅ Fase guardada.", 4);
      if (sesion.panelOriginal) await actualizarPanelFisico(sesion.panelOriginal, sesion.cursoId);
    } catch (e) {
      console.error(e);
      enviarTemp(message.channel, "❌ Error al subir archivo.", 5);
    }
  }

  if (sesion.modo === 'CREANDO_QUIZ') {
    const contenido = message.content;

    try {
      await message.delete();
    } catch (e) {}

    const estado = sesion.tempQuiz;

    if (estado.step === 0) {
      if (contenido.toUpperCase() === 'TERMINAR') {
        if (estado.preguntas.length === 0) return enviarTemp(message.channel, "⚠️ Agrega al menos una pregunta.", 5);
        const nuevoQuiz = await Quiz.create({
          title: estado.titulo,
          type: estado.esExamenFinal ? 'FINAL_EXAM' : 'QUIZ',
          questions: estado.preguntas,
          createdByDiscordId: message.author.id,
          courseId: sesion.cursoId
        });
        const curso = await Course.findById(sesion.cursoId);
        if (estado.esExamenFinal) curso.finalExamId = nuevoQuiz._id;else curso.phases.push({
          order: curso.phases.length + 1,
          title: "Evaluación",
          type: 'QUIZ',
          quizId: nuevoQuiz._id
        });
        await curso.save();
        sesion.modo = 'MENU';
        enviarTemp(message.channel, `✅ **${estado.esExamenFinal ? 'Examen' : 'Quiz'} Guardado.**`, 5);
        if (sesion.panelOriginal) await actualizarPanelFisico(sesion.panelOriginal, sesion.cursoId);
        return;
      }

      estado.tempPregunta = contenido;
      estado.step = 1;
      return enviarTemp(message.channel, `❓ Pregunta guardada: "${contenido}".\n👉 Ahora escribe las opciones separadas por coma. Ej: Rojo, Azul (1)`, 10);
    }

    if (estado.step === 1) {
      const regex = /(.+)\((\d+)\)$/;
      const match = contenido.match(regex);
      if (!match) return enviarTemp(message.channel, "⚠️ Formato incorrecto. Usa: Opción A, Opción B (1)", 5);
      const opciones = match[1].split(',').map(s => s.trim());
      const correcta = parseInt(match[2]) - 1;
      if (correcta < 0 || correcta >= opciones.length) return enviarTemp(message.channel, "⚠️ Índice inválido.", 5);
      estado.preguntas.push({
        text: estado.tempPregunta,
        options: opciones,
        correctIndex: correcta
      });
      estado.step = 0;
      return enviarTemp(message.channel, `✅ Pregunta #${estado.preguntas.length} lista. Escribe la siguiente o TERMINAR.`, 5);
    }
  }
}); // =========================================================================
//  FUNCIONES AUXILIARES

async function actualizarPanelFisico(interaction, cursoId) {
  try {
    const curso = await Course.findById(cursoId);
    const tieneExamen = !!curso.finalExamId;
    const embed = new EmbedBuilder().setTitle(`🛠️ Panel Privado: ${curso.title}`).setDescription(`**Fases:** ${curso.phases.length}\n**Examen:** ${tieneExamen ? '✅' : '❌'}`).setColor(tieneExamen ? '#2ecc71' : '#e67e22');
    const row1 = new ActionRowBuilder().addComponents(new ButtonBuilder().setCustomId('btn_add_video').setLabel('Video').setStyle(ButtonStyle.Primary).setEmoji('🎥'), new ButtonBuilder().setCustomId('btn_add_img').setLabel('Imagen').setStyle(ButtonStyle.Success).setEmoji('🖼️'), new ButtonBuilder().setCustomId('btn_add_quiz').setLabel('Quiz').setStyle(ButtonStyle.Secondary).setEmoji('📝'));
    const row2 = new ActionRowBuilder().addComponents(new ButtonBuilder().setCustomId('btn_add_final_exam').setLabel('Examen Final').setStyle(ButtonStyle.Danger).setDisabled(tieneExamen), new ButtonBuilder().setCustomId('btn_publicar').setLabel('🚀 PUBLICAR').setStyle(ButtonStyle.Success).setDisabled(!tieneExamen));
    await interaction.editReply({
      content: " ",
      embeds: [embed],
      components: [row1, row2]
    });
  } catch (e) {
    console.error("Error panel:", e);
  }
}

async function mostrarFaseReproductor(interaction, cursoId, faseIndex) {
  // BLINDAJE: Si llega un índice negativo por error, corregir
  if (faseIndex < 0 || isNaN(faseIndex)) faseIndex = 0;
  const curso = await Course.findById(cursoId); // BLINDAJE: Si el curso ya no existe

  if (!curso) return interaction.reply({
    content: "Error: Curso no encontrado.",
    ephemeral: true
  }); // --- FIN DEL CURSO (EXAMEN FINAL) ---

  if (faseIndex >= curso.phases.length) {
    const row = new ActionRowBuilder().addComponents(new ButtonBuilder().setCustomId(`start_exam_${curso.finalExamId}`).setLabel('🎓 Iniciar Examen Final').setStyle(ButtonStyle.Success), new ButtonBuilder().setCustomId(`cancel_course_${cursoId}`).setLabel('Cancelar').setStyle(ButtonStyle.Danger).setEmoji('❌'));
    const embed = new EmbedBuilder().setTitle("🏆 Fin del Contenido").setDescription("Has completado todas las fases. Es hora del Examen Final.").setColor('Gold');
    const payload = {
      embeds: [embed],
      components: [row],
      content: "",
      files: []
    };
    if (interaction.message) return interaction.update(payload);
    return interaction.reply({ ...payload,
      ephemeral: true
    });
  }

  const fase = curso.phases[faseIndex];
  if (!fase) return interaction.reply({
    content: "Error: Fase corrupta. Cancela el curso.",
    ephemeral: true
  }); // Detectar si es video (si NO es imagen, asumimos video)

  const esVideo = fase.mediaUrl && !fase.mediaUrl.match(/\.(jpeg|jpg|gif|png|webp)$/i);
  let contentMsg = "";
  let embedsEnviados = [];
  let filesEnviados = [];

  if (esVideo) {
    // --- 🎥 MODO VIDEO (Texto Arriba Forzado) ---
    // TRUCO: Usamos "###" para hacerlo encabezado grande y ">" para simular un bloque/cita
    // Esto garantiza que el texto aparezca ARRIBA del video.
    contentMsg = `### 🎬 ${curso.title}\n` + `> **Fase ${faseIndex + 1}:** ${fase.textContent || "Lección en video"}\n` + `> *Haz clic en el video para ampliar.* 👇`; // Ya no enviamos Embed aquí para no duplicar info y ensuciar la pantalla

    embedsEnviados = [];

    if (fase.mediaUrl) {
      filesEnviados = [{
        attachment: fase.mediaUrl,
        name: 'clase_video.mp4'
      }];
    }
  } else {
    // --- 🖼️ MODO TEXTO / IMAGEN (Embed Clásico) ---
    // Aquí sí usamos Embed porque las imágenes se comportan bien dentro de ellos
    const embed = new EmbedBuilder().setTitle(`📖 ${curso.title} | Fase ${faseIndex + 1}`).setDescription(fase.textContent || "Lee el contenido...").setColor('Blue');
    if (fase.mediaUrl) embed.setImage(fase.mediaUrl);
    embedsEnviados = [embed];
    contentMsg = "";
  } // --- BOTONES ---


  const row = new ActionRowBuilder();

  if (faseIndex > 0) {
    row.addComponents(new ButtonBuilder().setCustomId(`player_prev_${cursoId}_${faseIndex}`).setLabel('⬅️ Anterior').setStyle(ButtonStyle.Secondary));
  }

  if (fase.type === 'QUIZ') {
    row.addComponents(new ButtonBuilder().setCustomId(`start_quiz_${fase.quizId}`).setLabel('📝 Contestar Quiz').setStyle(ButtonStyle.Primary));
  } else {
    row.addComponents(new ButtonBuilder().setCustomId(`player_next_${cursoId}_${faseIndex}`).setLabel('Siguiente ➡️').setStyle(ButtonStyle.Primary));
  }

  row.addComponents(new ButtonBuilder().setCustomId(`cancel_course_${cursoId}`).setLabel('Salir').setStyle(ButtonStyle.Danger).setEmoji('❌')); // --- ENVÍO ---

  const payload = {
    content: contentMsg,
    embeds: embedsEnviados,
    components: [row],
    files: filesEnviados
  };
  if (interaction.message) await interaction.update(payload);else await interaction.reply({ ...payload,
    ephemeral: true
  });
}

async function mostrarPreguntaExamen(interaction) {
  const sesion = tomaQuizSesion.get(interaction.user.id); // Validación de seguridad por si la sesión expiró

  if (!sesion) return interaction.reply({
    content: "⚠️ Sesión expirada. Vuelve a iniciar el curso.",
    ephemeral: true
  });
  const pregunta = sesion.preguntas[sesion.indicePregunta]; // --- DISEÑO PREMIUM DE LA TARJETA ---

  const embed = new EmbedBuilder().setTitle(`🧠 Evaluación de Conocimientos`).setColor('Orange') // Naranja para diferenciarlo de las clases (Azul)
  .addFields( // 1. Barra de Progreso Visual
  {
    name: `Avance: Pregunta ${sesion.indicePregunta + 1} de ${sesion.preguntas.length}`,
    value: generarBarraProgreso(sesion.indicePregunta + 1, sesion.preguntas.length)
  }, // 2. La Pregunta Resaltada (Usa bloque de código 'fix' para que se vea amarillo/naranja)
  {
    name: '❓ Pregunta:',
    value: `\`\`\`fix\n${pregunta.text}\n\`\`\``
  }).setFooter({
    text: 'Selecciona tu respuesta en el menú desplegable 👇'
  }).setThumbnail('https://cdn-icons-png.flaticon.com/512/3407/3407024.png'); // Icono de examen (opcional)
  // Si la pregunta tiene una imagen de apoyo (diagrama, foto), la mostramos

  if (pregunta.mediaUrl) {
    embed.setImage(pregunta.mediaUrl);
  } // --- MENÚ DE RESPUESTAS ---


  const menu = new StringSelectMenuBuilder().setCustomId('quiz_responder').setPlaceholder('🤔 Selecciona la mejor opción...');
  pregunta.options.forEach((opt, index) => {
    // Cortamos el texto a 100 caracteres por límites de Discord
    menu.addOptions(new StringSelectMenuOptionBuilder().setLabel(opt.substring(0, 100)).setValue(index.toString()).setEmoji('🔸') // Decoración
    );
  });
  const payload = {
    embeds: [embed],
    components: [new ActionRowBuilder().addComponents(menu)],
    content: " " // Limpiamos contenido texto para que se vea limpio

  };

  if (interaction.isButton() || interaction.isStringSelectMenu()) {
    await interaction.update(payload);
  } else {
    await interaction.reply({ ...payload,
      ephemeral: true
    });
  }
}

async function finalizarExamen(interaction, sesion) {
  const calificacion = sesion.aciertos / sesion.preguntas.length * 100;
  const aprobado = calificacion >= NOTA_MINIMA_APROBATORIA; // Obtener datos frescos

  const emp = await Employee.findOne({
    discordId: interaction.user.id
  }).populate('enrolledCourses.courseId');
  const quizDoc = await Quiz.findById(sesion.quizId);
  const cursoId = quizDoc.courseId;
  const inscripcion = emp.enrolledCourses.find(c => c.courseId._id.toString() === cursoId.toString()); // Fix de fase

  if (isNaN(inscripcion.currentPhase)) inscripcion.currentPhase = 0;
  const cursoReal = await Course.findById(cursoId);
  const totalFases = cursoReal.phases.length || 1;
  const indiceFaseActual = cursoReal.phases.findIndex(p => p.quizId && p.quizId.toString() === sesion.quizId.toString());
  const siguienteFaseIndex = indiceFaseActual !== -1 ? indiceFaseActual + 1 : (inscripcion.currentPhase || 0) + 1; // Guardar Intento

  try {
    await QuizAttempt.create({
      employeeDiscordId: interaction.user.id,
      courseId: cursoId,
      quizId: sesion.quizId,
      type: sesion.esExamenFinal ? 'FINAL_EXAM' : 'QUIZ',
      answers: sesion.respuestasUsuario,
      score: calificacion,
      passed: aprobado
    });
  } catch (e) {
    console.error("Error historial:", e);
  }

  let mensajeFinal = "";
  const row = new ActionRowBuilder();

  if (aprobado) {
    if (sesion.esExamenFinal) {
      // --- ✅ CURSO COMPLETADO ---
      inscripcion.status = 'Completed';
      inscripcion.progress = 100;
      inscripcion.currentPhase = totalFases;
      inscripcion.completedAt = new Date();
      mensajeFinal = `🏆 **¡FELICIDADES! HAS FINALIZADO EL CURSO**\n\n` + `Has aprobado **${cursoReal.title}** con **${calificacion.toFixed(0)}%**.\n` + `⏳ Generando tu certificado oficial, espera un momento...`; // GENERACIÓN DEL PDF CON LA NUEVA FUNCIÓN

      try {
        const fechaFormat = new Date().toLocaleDateString('es-MX', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric'
        }).replace(/\//g, '-');
        const bufferPDF = await crearPDFCertificado(emp.name + " " + emp.lastName, cursoReal.title, fechaFormat);
        const archivoAdjunto = new AttachmentBuilder(bufferPDF, {
          name: `Diploma_${emp.numberEmployee}_${cursoReal.title}.pdf`
        }); // 1. ENVIAR AL EMPLEADO (DM)

        try {
          const usuarioDiscord = await client.users.fetch(interaction.user.id);
          await usuarioDiscord.send({
            content: `🎓 **¡Aquí tienes tu Certificado!**\n\nFelicidades **${emp.name}**, adjunto encontrarás el documento oficial de Axiom Paperless.\nCurso: **${cursoReal.title}**`,
            files: [archivoAdjunto]
          });
          mensajeFinal += "\n✅ **¡Certificado enviado a tu MD!**";
        } catch (dmError) {
          mensajeFinal += "\n⚠️ No pude enviarte DM (Privados cerrados). Pídelo a RH.";
        } // 2. ENVIAR AL CANAL DE CONTROL (ENROLLERS)


        const canalNotif = client.channels.cache.get(process.env.CHANNEL_ID_NOTIFICACIONES);

        if (canalNotif) {
          await canalNotif.send({
            content: `🔔 **Certificación Completada**\n👤 **${emp.name} ${emp.lastName}** (${emp.numberEmployee})\n📘 **${cursoReal.title}**\n📅 ${fechaFormat}\n\n👇 Copia de archivo para expediente:`,
            files: [archivoAdjunto]
          });
        }
      } catch (errorPDF) {
        console.error("Error generando PDF automático:", errorPDF);
        mensajeFinal += "\n⚠️ Hubo un error generando el PDF, contacta a RRHH.";
      }
    } else {
      // --- AVANZAR FASE ---
      inscripcion.currentPhase = siguienteFaseIndex;
      inscripcion.progress = Math.min(100, Math.round(inscripcion.currentPhase / totalFases * 100));
      mensajeFinal = `✅ **¡Aprobado!** (${calificacion.toFixed(0)}%)\nFase desbloqueada.`;
      let btnTarget = siguienteFaseIndex - 1;
      row.addComponents(new ButtonBuilder().setCustomId(`player_next_${cursoId}_${btnTarget}`).setLabel('Continuar ➡️').setStyle(ButtonStyle.Success));
    }
  } else {
    // --- REPROBADO ---
    if (sesion.esExamenFinal) {
      mensajeFinal = `🚫 **¡Reprobado!** (${calificacion.toFixed(0)}%)\n⚠️ Debes reiniciar el curso.`;
      inscripcion.currentPhase = 0;
      inscripcion.progress = 0;
      inscripcion.status = 'In Progress';
      row.addComponents(new ButtonBuilder().setCustomId(`player_next_${cursoId}_-1`).setLabel('🔄 Reiniciar').setStyle(ButtonStyle.Danger));
    } else {
      mensajeFinal = `❌ **Reprobado** (${calificacion.toFixed(0)}%)\nReinténtalo.`;
      row.addComponents(new ButtonBuilder().setCustomId(`start_quiz_${sesion.quizId}`).setLabel('🔄 Reintentar').setStyle(ButtonStyle.Secondary));
      let repasarTarget = Math.max(0, indiceFaseActual - 1); // Volver un paso atrás del quiz actual
      // Ajuste para el botón player_next que suma 1: Enviamos target - 1

      row.addComponents(new ButtonBuilder().setCustomId(`player_next_${cursoId}_${repasarTarget - 1}`).setLabel('⬅️ Repasar Material').setStyle(ButtonStyle.Primary));
    }
  }

  await emp.save();
  tomaQuizSesion.delete(interaction.user.id);
  await interaction.update({
    content: mensajeFinal,
    embeds: [],
    components: row.components.length > 0 ? [row] : []
  });
} // Función auxiliar para generar barra de progreso


function generarBarraProgreso(actual, total) {
  const totalBloques = 10;
  const progreso = Math.round(actual / total * totalBloques);
  const llenos = '🟦'.repeat(progreso);
  const vacios = '⬜'.repeat(totalBloques - progreso);
  return `${llenos}${vacios} **${Math.round(actual / total * 100)}%**`;
} // =========================================================================
//  FUNCIÓN GENERADORA DE CERTIFICADOS (MOTOR PDF)
// =========================================================================


async function crearPDFCertificado(nombreEmpleado, nombreCurso, fechaTexto) {
  const {
    PDFDocument,
    rgb
  } = require('pdf-lib');

  const fontkit = require('@pdf-lib/fontkit'); // 🔥 NECESARIO PARA FUENTES CUSTOM


  const fs = require('fs');

  const path = require('path'); // 1. Cargar Archivos (Template y Fuente)


  const rutaTemplate = path.join(__dirname, '../assets/certificado_base.pdf');
  const rutaFuente = path.join(__dirname, '../assets/fuente_nombre.ttf'); // Tu fuente manuscrita

  if (!fs.existsSync(rutaTemplate)) throw new Error("⚠️ No existe src/assets/certificado_base.pdf");
  if (!fs.existsSync(rutaFuente)) throw new Error("⚠️ No existe src/assets/fuente_nombre.ttf");
  const templateBytes = fs.readFileSync(rutaTemplate);
  const fuenteBytes = fs.readFileSync(rutaFuente); // 2. Inicializar Documento

  const pdfDoc = await PDFDocument.load(templateBytes); // 🔥 Registrar Fontkit para usar .ttf

  pdfDoc.registerFontkit(fontkit); // Incrustar las fuentes

  const customFont = await pdfDoc.embedFont(fuenteBytes); // Fuente para el Nombre

  const standardFont = await pdfDoc.embedFont(require('pdf-lib').StandardFonts.HelveticaBold); // Fuente para el Curso
  // Obtener la primera página y sus dimensiones

  const pages = pdfDoc.getPages();
  const firstPage = pages[0];
  const {
    width,
    height
  } = firstPage.getSize(); // 🎨 COLOR AXIOM (Azul Oscuro aprox de la imagen)
  // En pdf-lib los colores van de 0.0 a 1.0. 
  // Un Azul Marino (#1F3A70) sería aprox: R:0.12, G:0.22, B:0.44

  const colorAxiom = rgb(0.12, 0.22, 0.44);
  const colorNegro = rgb(0, 0, 0); // =========================================================
  // ✍️ ESCRIBIR DATOS (Coordenadas ajustadas al diseño Axiom)
  // =========================================================
  // 1. NOMBRE DEL COLABORADOR (Estilo Manuscrito)

  const textNombre = nombreEmpleado; // No lo ponemos mayúsculas forzadas si la fuente es manuscrita bonita

  const sizeNombre = 42; // Tamaño grande

  const textWidthName = customFont.widthOfTextAtSize(textNombre, sizeNombre);
  firstPage.drawText(textNombre, {
    x: width / 2 - textWidthName / 2,
    // Centrado horizontal exacto
    y: height / 2 - 20,
    // ⬆️ Juega con este valor para subir/bajar el nombre
    size: sizeNombre,
    font: customFont,
    // Usamos la fuente .ttf cargada
    color: colorAxiom // Azul Axiom

  }); // 2. NOMBRE DEL CURSO (Estilo Formal/Bold)

  const textCurso = nombreCurso.toUpperCase();
  const sizeCurso = 20;
  const textWidthCurso = standardFont.widthOfTextAtSize(textCurso, sizeCurso);
  firstPage.drawText(textCurso, {
    x: width / 2 - textWidthCurso / 2,
    // Centrado horizontal
    y: height / 2 - 115,
    // ⬇️ Más abajo que el nombre
    size: sizeCurso,
    font: standardFont,
    // Helvética Bold
    color: colorAxiom
  }); // 3. FECHA (Esquina inferior derecha)
  // La imagen muestra la fecha muy abajo a la derecha

  const textFecha = fechaTexto; // Ej: "19-01-2025"

  const sizeFecha = 12;
  const textWidthFecha = standardFont.widthOfTextAtSize(textFecha, sizeFecha);
  firstPage.drawText(textFecha, {
    x: width - textWidthFecha - 40,
    // Pegado a la derecha con margen de 40px
    y: 40,
    // 40px desde el fondo
    size: sizeFecha,
    font: standardFont,
    color: colorNegro
  }); // Guardar y devolver Buffer

  const pdfBytes = await pdfDoc.save();
  return Buffer.from(pdfBytes);
}

const connectDiscordBot = async () => {
  try {
    await client.login(process.env.DISCORD_TOKEN);
  } catch (e) {
    console.error("Error Login Bot:", e);
  }
};

module.exports = {
  connectDiscordBot
}; // // 9. PROCESAR ASIGNACIÓN (Al seleccionar del menú de RRHH)
// if (interaction.isStringSelectMenu() && interaction.customId.startsWith('asignar_seleccion_')) {
//     const empleadoId = interaction.customId.split('asignar_seleccion_')[1];
//     const cursoId = interaction.values[0];
//     await interaction.deferReply({ ephemeral: true });
//     try {
//         const emp = await Employee.findById(empleadoId);
//         const curso = await Course.findById(cursoId);
//         if (!emp || !curso) return interaction.editReply("❌ Error: Empleado o Curso no encontrado.");
//         // 1. Verificar si ya lo tiene
//         const yaInscrito = emp.enrolledCourses.find(c => c.courseId.toString() === cursoId);
//         if (yaInscrito) {
//             return interaction.editReply(`⚠️ **${emp.name} ${emp.lastName}** ya está inscrito en el curso "${curso.title}" (Estado: ${yaInscrito.status}).`);
//         }
//         // 2. Inscribir Forzosamente
//         emp.enrolledCourses.push({
//             courseId: curso._id,
//             currentPhase: 0,
//             progress: 0,
//             status: 'In Progress',
//             enrolledAt: new Date()
//         });
//         await emp.save();
//         // 3. Notificar al Instructor (Tú)
//         await interaction.editReply(`✅ **¡Asignación Exitosa!**\nHas inscrito a **${emp.name} ${emp.lastName}** en el curso: *${curso.title}*.`);
//         // 4. Notificar al Empleado (DM)
//         try {
//             const usuarioDiscord = await client.users.fetch(emp.discordId);
//             const embedAviso = new EmbedBuilder()
//                 .setTitle("🚨 Nueva Asignación de Curso")
//                 .setDescription(`Hola **${emp.name}**,\n\nEl departamento de instrucción te ha asignado un nuevo curso obligatorio.`)
//                 .addFields(
//                     { name: '📘 Curso', value: curso.title },
//                     { name: '📅 Fecha', value: new Date().toLocaleDateString() }
//                 )
//                 .setColor('Red') // Rojo para denotar importancia/obligatoriedad
//                 .setFooter({ text: 'Usa /mis-cursos para comenzar.' });
//             await usuarioDiscord.send({ embeds: [embedAviso] });
//         } catch (dmError) {
//             // Si el usuario tiene los DMs cerrados, avisamos al instructor pero no fallamos la operación
//             await interaction.followUp({ content: "⚠️ Nota: El curso se asignó, pero no pude enviar DM al usuario (tiene privados bloqueados).", ephemeral: true });
//         }
//     } catch (error) {
//         console.error(error);
//         await interaction.editReply("❌ Error al procesar la asignación.");
//     }
// }
// ---------------------------------------------------------------------
// 1. COMANDO: /VINCULAR
// ---------------------------------------------------------------------
// if (interaction.isChatInputCommand() && interaction.commandName === 'vincular') {
//     const numEmpleado = interaction.options.getString('numero_empleado');
//     await interaction.deferReply({ ephemeral: true });
//     try {
//         const emp = await Employee.findOne({ numberEmployee: numEmpleado });
//         if (!emp || emp.active === false) {
//             return interaction.editReply("❌ **Error:** Número de empleado no encontrado o inactivo.");
//         }
//         if (emp.discordId && emp.discordId !== interaction.user.id) {
//             return interaction.editReply("⚠️ **Error:** Número ya asociado a otra cuenta.");
//         }
//         emp.discordId = interaction.user.id;
//         await emp.save();
//         const member = interaction.member;
//         const rolEmpDiscord = interaction.guild.roles.cache.get(ROLE_EMPLEADO);
//         if (rolEmpDiscord) await member.roles.add(rolEmpDiscord);
//         let mensaje = `✅ **¡Identidad Confirmada!**\nHola **${emp.name}**, acceso concedido.`;
//         if (emp.user === true) {
//             const webUser = await User.findOne({ employee: emp._id });
//             if (webUser) {
//                 const roles = await Role.find({ _id: { $in: webUser.roles } });
//                 let esInstructor = roles.some(r => r.name === "admin" || r.name === "Instructor");
//                 if (esInstructor) {
//                     const rolInstDiscord = interaction.guild.roles.cache.get(ROLE_INSTRUCTOR);
//                     if (rolInstDiscord) await member.roles.add(rolInstDiscord);
//                     mensaje += `\n🌟 **Instructor:** Permisos de Admin detectados.`;
//                 }
//             }
//         }
//         await interaction.editReply(mensaje);
//     } catch (error) {
//         console.error(error);
//         await interaction.editReply("❌ Error interno.");
//     }
// }
// ---------------------------------------------------------------------
// 2. COMANDO: /CREAR-CURSO (MODO PRIVADO/EFÍMERO)
// ---------------------------------------------------------------------
// ---------------------------------------------------------------------
// COMANDO: /VER-CURSOS (Ahora con Categorías)
// ---------------------------------------------------------------------
// ---------------------------------------------------------------------
// 5. COMANDO: /MIS-CURSOS (CON REPORTE DE CALIFICACIONES)
// ---------------------------------------------------------------------
// ---------------------------------------------------------------------
// ---------------------------------------------------------------------
// 7. MOTOR DE EXÁMENES
// ---------------------------------------------------------------------
// ---------------------------------------------------------------------
// 5. COMANDO: /ASIGNAR-CURSO (Paso 1: Buscar Empleado + Mostrar Categorías)
// ---------------------------------------------------------------------
// ---------------------------------------------------------------------
// 10. COMANDO: /ADMIN-REPORTE (Ver stats de un curso)
// ---------------------------------------------------------------------
// ---------------------------------------------------------------------
// COMANDO: 
// ---------------------------------------------------------------------
// COMANDO: 
// ---------------------------------------------------------------------
// COMANDO: 
// ---------------------------------------------------------------------
// COMANDO: 
// ---------------------------------------------------------------------
// COMANDO: