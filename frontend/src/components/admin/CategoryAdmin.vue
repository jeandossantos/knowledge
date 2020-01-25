<template>
  <div class="category-admin">
      <b-form>
        <input type="hidden" v-model="category.id" id="category-id"/>
        <b-row>
          <b-col xs="12">
            <b-form-group label="Nome:" label-form="category-name">
              <b-form-input v-model="category.name" id="category-name" type="text"
              :readOnly="mode === 'remove'" required placeholder="Insira o Nome da Categoria"/>
            </b-form-group>
          </b-col>
        </b-row>
        <b-row v-if="mode === 'save'">
          <b-col xs="12">
            <b-form-group label="Categoria Pai:" label-form="category-parentId">
              <b-form-select id="category-parentId" v-model="category.parentId" 
              :options="categories"/>
            </b-form-group>
          </b-col>
        </b-row>
        <b-row v-else>
          <b-col xs="12">
            <b-form-group label="Categoria Pai:" label-form="category-parentId">
              <b-form-input v-model="category.path" id="category-parentId" type="text"
              readOnly />
            </b-form-group>
          </b-col>
        </b-row>
        <b-button variant="primary" class="mr-2" v-if="mode === 'save'" @click="save">Salvar</b-button>
        <b-button variant="danger" class="mr-2" v-if="mode === 'remove'" @click="remove">Excluir</b-button>
        <b-button @click="reset">Cancelar</b-button>
        <hr>
      </b-form>
      <b-table hover striped :items="categories" :fields="fields">
        <template slot="actions" slot-scope="data">
          <b-button variant="warning" class="mr-2" @click="loadUser(data.item)">
            <i class="fa fa-pencil"></i>
          </b-button>
          <b-button variant="danger" @click="loadUser(data.item, 'remove')">
            <i class="fa fa-trash"></i>
          </b-button>
        </template>
      </b-table>
  </div>
</template>

<script>
import { baseApiUrl, showError } from '@/global';
import axios from 'axios';

export default {
    name: 'CategoryAdmin',
    data: function() {
      return {
        mode: 'save',
        url: `${baseApiUrl}/categories`,
        category: {},
        categories: [],
        fields: [
          { key: 'id', label: 'Código', sortable: true },
          { key: 'name', label: 'Nome', sortable: true },
          { key: 'path', label: 'Caminho', sortable: true },
          { key: 'actions', label: 'Ações' }
        ]
      }
    },
    methods: {
        loadUsers() {
          axios.get(this.url)
          .then(resp => {
            this.categories = resp.data.map(category => {
              return { ...category, value: category.id, text: category.path }
            })
          })
            .catch(showError)
        },
        save() {
           const method = this.category.id ? 'put' : 'post'
            const id = this.category.id ? `/${this.category.id}` : ''
            axios[method](`${baseApiUrl}/categories${id}`, this.category)
                .then(() => {
                    this.$toasted.global.defaultSuccess()
                    this.reset()
                })
                .catch(showError)
        },
        remove() {
          axios.delete(`${this.url}/${this.category.id}`)
          .then(() => {
            this.$toasted.global.defaultSuccess();
            this.loadUsers();
            this.reset();
          })
          .catch(showError)
        },
        reset() {
          this.mode = 'save';
          this.category = {};
          this.loadUsers();
        },
        loadUser(category, mode = 'save') {
          this.mode = mode;
          this.category = { ...category };
        }
    },
    mounted() {
      this.loadUsers();
    }
}
</script>

<style>
.category-admin {
        padding: 10px;
    }
</style>