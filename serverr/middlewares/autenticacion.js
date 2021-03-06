const jwt = require('jsonwebtoken');


// ====================
// Verificar Token
// ====================

let verificaToken = (req, res, next) => {

    let token = req.get('Authorization');
    jwt.verify( token, process.env.SEED, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                ok: false,
                err: {
                    message: 'Token no valido'
                }
            })
        }

        req.usuario = decoded.usuario;
        next();

    })
      
}

// ====================
// Verificar Token
// ====================

let verificaAdmin= (req, res, next) => {

    let usuario = req.usuario;

    if (usuario.role === 'ADMIN_ROLE') {
        next();
    }else{
        return res.json({
            ok:false,
            err:{message: 'El usuario no es administrador'}
        });
    } 
}

let verificaCreador = (req, res, next) => {
    if( req.usuario._id !== Categoria.usuario){
        return res.json({
            ok:false,
            err:{
                message: 'No eres el creador de esta categoria'
            }
        })

    }else{
        next();
    }
    
}




module.exports = {

    verificaToken,
    verificaAdmin,
    verificaCreador
}