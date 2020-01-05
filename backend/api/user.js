const bcrypt = require('bcrypt-nodejs');

module.exports = app => {

    const { existsOrError, notExistsOrError, equalsOrError } = app.api.validation;

    const encryptPassword = password => {
        const salt = bcrypt.genSaltSync(10);
        return bcrypt.hashSync(password, salt);
    }

    const save = async (req, resp) => {
        const user = { ...req.body };
        if(req.params.id) user.id = req.params.id;

        try {
            existsOrError(user.name, 'Nome não informado!');
            existsOrError(user.email, 'E-mail não informado!');
            existsOrError(user.password, 'Senha não informado!');
            existsOrError(user.confirmPassword, 'Confirmação de Senha inválida!');
            equalsOrError(user.password, user.confirmPassword, 'Senhas não conferem!');

            const userFromDB = await app.db('users').where({ email: user.email }).first();

            if(!user.id){
                notExistsOrError(userFromDB, 'Usuário já cadastrado!');
            }
        } catch (msg) {
            return  resp.status(400).send(msg);
        }

        user.password = encryptPassword(user.password);
        delete user.confirmPassword;

        if (user.id){
            app.db('users').update(user).where({ id: user.id })
            .then(_ => resp.status(204).send())
            .catch(error => resp.status(500).send(error))
        } else {
            app.db('users').insert(user)
            .then(_ => resp.status(204).send())
            .catch(error => resp.status(500).send(error))
        }
    }

    const get = (req, resp) => {
        app.db('users').select('id', 'name', 'email', 'admin')
        .then(users => resp.json(users))
        .catch(error => resp.status(500).send(error))
    }

    const getById = (req, resp) => {
        app.db('users').select('id', 'name', 'email', 'admin').where({ id: req.params.id }).first()
        .then(user => resp.json(user))
        .catch(error => resp.status(500).send(error))
    }

    return { save, get, getById }
}