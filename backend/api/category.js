module.exports = app => {
    
    const { existsOrError, notExistsOrError, equalsOrError } = app.api.validation;

    const save = (req, resp) => {
        const category = { ...req.body };

        if(req.params.id) category.id = req.params.id;

        try {
            existsOrError(category.name, 'Nome não informado!');
        } catch (msg) {
            return resp.status(500).send(msg);
        }

        if(category.id){
            app.db('categories').update(category).where({ id: category.id })
            .then(_ => resp.status(204).send())
            .catch(error => resp.status(500).send(error))
        }else {
            app.db('categories').insert(category)
            .then(_ => resp.status(204).send())
            .catch(error => resp.status(500).send(error))
        }
    }

    const remove = async (req, resp) => {
        try {
            existsOrError(req.params.id, 'Código da categoria não informado!');
            
            const subCategory = await app.db('categories').where({ parentId: req.params.id });
            notExistsOrError(subCategory, 'Categoria possui subcategorias!')

            const articles = await app.db('articles').where({ categoryId: req.params.id });
            notExistsOrError(articles, 'Categoria possui artigos!');
            
            const rowsDeleted = await app.db('categories').where({ id: req.params.id }).del();
            existsOrError(rowsDeleted, 'Categoria não foi encontrada!');
            
            resp.status(204).send();
        } catch (msg) {
            resp.status(400).send(msg);
        }
    }

    const withPath = categories => {
        const getParent = (categories, parentId) => {
            const parent = categories.filter(parent => parent.id === parentId);
            return (parent) ? parent[0] : null;
        }
        const categoriesWithPath = categories.map(category => {
            let path = category.name;
            let parent = getParent(categories, category.parentId);

            while(parent){
                path = `${parent.name} > ${path}`;
                parent = getParent(categories, parent.categoryId);
            }

            return { ...category, path }
        })

        categoriesWithPath.sort((a, b) => {
            if(a.path < b.path) return -1;
            if(a.path > b.path) return 1;
            return 0;
        })
        return categoriesWithPath;
    }

    const getAll = (req, resp) => {
        app.db('categories')
        .then(categories => resp.json(withPath(categories)))
        .catch(error => resp.status(500).send(error))
    }

    const getById = (req, resp) => {
        app.db('categories').where({ id: req.params.id })
        .then(category => resp.json(category))
    }

    const toTree = (categories, tree) => {
        if(!tree) tree = categories.filter(c => !c.pararentId);
        tree = tree.map(parentNode => {
            
            const isChild = node => node.parentId == parentNode.id;
           
            parentNode.children = toTree(categories, categories.filter(isChild));
            return parentNode;
        })
        return tree;
    }

    const getTree = (req, resp) => {
        app.db('categories')
        .then(categories => resp.json(toTree(categories)))
        .catch(error => resp.status(500).send(error))
    }

    return { save, remove, getAll, getById, getTree }
}