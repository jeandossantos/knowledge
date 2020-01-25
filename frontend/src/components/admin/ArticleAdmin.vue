<template>
  <div class="article-admin">
      <input type="hidden" v-model="article.id" id="article-id"/>
      <b-row>
        <b-col xs="12">
          <b-form-group label="Nome:" label-form="article-name">
            <b-form-input id="article-id" type="text" v-model="article.name" required
              :readOnly="mode === 'remove'"  placeholder="Insira o Nome do Artigo..."/>
          </b-form-group>
          <b-form-group label="Descrição:" label-form="article-description">
            <b-form-input id="article-description" type="text" v-model="article.description" required
              :readOnly="mode === 'remove'"  placeholder="Insira a Descrição do Artigo..."/>
          </b-form-group>
          <b-form-group v-if="mode === 'save'" label="Imagem (URL):" label-form="article-imageUrl">
            <b-form-input type="text" v-model="article.imageUrl" id="article-imageUrl"
            required :readOnly="mode === 'remove'" placeholder="Inserir a Url da Imagem..."/>
          </b-form-group>
          <b-form-group v-if="mode === 'save'" label="Categoria:" label-form="article-categoryId">
            <b-form-select id="article-categoryId" v-model="article.categoryId" :options="categories"/>
          </b-form-group>
          <b-form-group v-if="mode === 'save'" label="Autor:" label-form="article-userId">
            <b-form-select id="article-userId" v-model="article.userId" :options="users"/>
          </b-form-group>
          <b-form-group v-if="mode === 'save'" label="Autor:" label-form="article-userId">
            <VueEditor  v-model="article.content" placeholder="Insira o Conteúdo..."/>
          </b-form-group>
          
        </b-col>
      </b-row>
      <b-button v-if="mode === 'save'" variant="primary" @click="save">Salvar</b-button>
      <b-button v-if="mode === 'remove'" variant="danger" @click="remove">Excluir</b-button>
      <b-button class="ml-2" @click="reset">Cancelar</b-button>
      <hr>
      <b-table striped hover :items="articles" :fields="fields">
        <template slot="actions" slot-scope="data">
          <b-button variant="warning" class="mr-2" @click="loadArticle(data.item)">
            <i class="fa fa-pencil"></i>
          </b-button>
          <b-button variant="danger" class="mr-2" @click="loadArticle(data.item, 'remove')">
            <i class="fa fa-trash"></i>
          </b-button>
        </template>
      </b-table>
       <b-pagination size="md" v-model="page" :total-rows="count" :per-page="limit" />
  </div>
</template>

<script>
import { VueEditor } from 'vue2-editor';
import { baseApiUrl, showError } from '@/global';
import axios from 'axios';

export default {
    name: 'ArticleAdmin',
    components: { VueEditor },
    data: function() {
      return {
        mode: 'save',
        article: {},
        articles: [],
        categories: [],
        users: [],
        page: 1,
        limit: 0,
        count: 0,
        fields: [
          { key: 'id', label: 'Código', sortable: true },
          { key: 'name', label: 'Nome', sortable: true },
          { key: 'description', label: 'Descrição', sortable: true },
          { key: 'actions', label: 'Ações'}
        ]
      }
    },
    methods: {
      reset() {
        this.mode = 'save';
        this.article = {};
        this.loadArticles();
      },
      loadArticles() {
            const url = `${baseApiUrl}/articles?page=${this.page}`
            axios.get(url).then(res => {
            this.articles = res.data.data
            this.count = res.data.count
            this.limit = res.data.limit
        })
        
      },
      save() {
        const method = this.article.id ? 'put' : 'post';
        const id = this.article.id ? `/${this.article.id}` : '';
        axios[method](`${baseApiUrl}/articles${id}`, this.article)
        .then(() => {
          this.$toasted.global.defaultSuccess();
          this.reset();
        })
        .catch(showError)
      },
      remove() {
        axios.delete(`${baseApiUrl}/articles/${this.article.id}`)
        .then(() => {
          this.$toasted.global.defaultSuccess();
          this.reset();
        })
        .catch(showError)
      },
      loadArticle(article, mode = 'save') {
        this.mode = mode;
        axios.get(`${baseApiUrl}/articles/${article.id}`)
        .then(resp => this.article = resp.data)
      },
      loadCategories() {
        const url = `${baseApiUrl}/categories`;
        axios.get(url).then(resp => {
          this.categories = resp.data.map(category => {
            return { value: category.id, text: category.path }
          })
        })
      },
      loadUsers() {
        const url = `${baseApiUrl}/users`;
        axios.get(url).then(resp => {
          this.users = resp.data.map(user => {
            return { value: user.id, text: `${user.name} - ${user.email}`}
          })
        })
      }
    },
    mounted() {
      this.loadArticles();
      this.loadCategories();
      this.loadUsers();

    },
     watch: {
        page() {
            this.loadArticles()
        }
    }
}
</script>

<style>
  .article-admin {
    padding: 10px;
  }
</style>