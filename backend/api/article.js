const queries = require('./queries');

module.exports = app => {
    const { existsOrError } = app.api.validation;

    const save = (req, resp) => {
        const articles = { ...req.body };
        
        if(req.params.id) articles.id = req.params.id;
        try {
            existsOrError(articles.name, 'Nome não informado!');
            existsOrError(articles.description, 'Descrição não informada!');
            existsOrError(articles.categoryId, 'Categoria não informada!');
            existsOrError(articles.userId, 'Autor não informado!');
            existsOrError(articles.content, 'Conteúdo não informado!');
        } catch (msg) {
            return resp.status(500).send(msg)
        }

       if(articles.id){
           app.db('articles').update(articles).where({ id: articles.id })
           .then(_ => resp.status(204).send())
           .catch(error => resp.status(500).send(error))
       }else{
           app.db('articles').insert(articles)
           .then(_ => resp.status(240).send())
           .catch(error => resp.status(500).send(error))
       }
    }

    const remove = async (req, resp) => {
        try {
            const rowsDeleted = await app.db('articles').where({ id: req.params.id }).del()
            existsOrError(rowsDeleted, 'Artigo não foi encontrado!');
            return resp.status(204).send();
        } catch (msg) {
           return resp.status(500).send(msg);
        }
    }

    const limit = 3;

    const get = async (req, resp) => {
        const page = req.query.page || 1;

        const result = await app.db('articles').count('id').first();
        count = parseInt(result.count);

        app.db('articles').select('id', 'name', 'description')
        .limit(limit).offset(page * limit - limit)
        .then(articles => resp.json({ data: articles, count, limit }))
        .catch(error => resp.status(500).send(error))
    }

    const getById = (req, resp) => {
        app.db('articles').where({ id: req.params.id })
        .first()
        .then(article => {
            article.content = article.content.toString();
            return resp.json(article);
        }).catch(error => resp.status(500).send(error));
    }

    const getByCategory = async (req, resp) => {
        const categoryId = req.params.id;
        const page = req.query.page || 1;
        const categories = await app.db.raw(queries.categoryWithChildren, categoryId);
        const ids = categories.rows.map(c => c.id);

        app.db({a: 'articles', u: 'users'})
        .select('a.id', 'a.name', 'a.description', 'a.imageUrl', { author: 'u.name' })
        .limit(limit).offset(page * limit - limit)
        .whereRaw('?? = ??', ['u.id', 'a.userId'])
        .whereIn('categoryId', ids)
        .orderBy('a.id', 'desc')
        .then(articles => resp.json(articles))
        .catch(error => resp.status(500).send(error))
    }

    return { save, remove, get, getById, getByCategory }
}