const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();

// Conectar a la base de datos MongoDB Atlas
mongoose.connect('mongodb+srv://user:user@cluster0.sm8mxhd.mongodb.net/?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('Conexión exitosa a MongoDB Atlas');
}).catch(err => {
  console.error('Error de conexión a MongoDB Atlas:', err);
});

// Configurar body-parser para manejar solicitudes JSON
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Definir el modelo de Alumno
const Alumno = mongoose.model('Alumno', {
  nombres: String,
  apellidos: String,
  ciclo: Number,
  seccion: String
});

// Configurar vistas con EJS
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

// Rutas

// Página principal con el formulario para agregar un alumno
app.get('/', (req, res) => {
  res.render('index');
});

// Endpoint para agregar un alumno
app.post('/agregar', (req, res) => {
  const { nombres, apellidos, ciclo, seccion } = req.body;
  const alumno = new Alumno({ nombres, apellidos, ciclo, seccion });
  alumno.save().then(() => {
    console.log('Alumno agregado con éxito');
    res.redirect('/listar');
  }).catch(err => {
    console.error('Error al agregar alumno:', err);
    res.redirect('/');
  });
});

// Página para listar alumnos
app.get('/listar', (req, res) => {
    Alumno.find({})
      .then(alumnos => {
        res.render('alumnos', { alumnos });
      })
      .catch(err => {
        console.error('Error al buscar alumnos:', err);
        res.status(500).send('Error interno del servidor');
      });
  });

// Ruta para eliminar un alumno por su ID
app.post('/eliminar/:id', async (req, res) => {
    const alumnoId = req.params.id;
    try {
      await Alumno.findByIdAndDelete(alumnoId);
      console.log('Alumno eliminado con éxito');
      res.redirect('/listar'); // Redirige al listado de alumnos
    } catch (err) {
      console.error('Error al eliminar alumno:', err);
      res.status(500).send('Error interno del servidor');
    }
  });

// Iniciar el servidor
const PORT = process.env.PORT || 9000;
app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});