const { io } = require('../server');
const { Usuarios } = require('../clases/usuarios');
const usuarios = new Usuarios();

class Ball {
    constructor(posX, posY) {
        this.posX = posX;
        this.posY = posY;
    }
}

var ball = new Ball(0, 0);
var score;
var lives;
var p1;
var p2;
var bricks;



io.on('connection', (client) => {

    client.on('disconnect', () => {
        usuarios.borrarUsuarios(client.id);
    });


    client.on('ingresarSala', (usuario, callback) => {
        if (!usuario.nombre || usuario.data) {
            return callback({
                error: true,
                mensaje: 'El nombre/sala es necesario'
            });
        }
        client.join(usuario.sala);
        usuarios.agregarUsuario(client.id, usuario.nombre, usuario.sala, usuario.posX);
        callback(usuarios.getUsuariosPorSala(usuario.sala));
    });

  

    client.on('update', (data) => {
        ball.posX = data.x;
        ball.posY = data.y;
        p1 = data.p1;
        p2 = data.p2;
        score = data.score;
        lives = data.lives;
        bricks = data.bricks;
    });


});

setInterval(update, 1000 / 30);

function update() {

    let data = {
        posX: ball.posX,
        posY: ball.posY,
        p1: p1,
        p2: p2,
        score: score,
        lives: lives,
        bricks: bricks
    };
    io.sockets.emit('updateServer', data);
}
