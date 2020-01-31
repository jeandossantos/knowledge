<template>
  <div class="article-item">
      <router-link :to="{ name: 'articleById', params: { id: article.id} }">
          <div class="article-item-img d-nono d-sm-block">
              <img v-if="article.imageUrl" :src="article.imageUrl" alt="Article"
              height="150" width="150">
              <img v-else src="@/assets/article.png" height="150"
              width="150" alt="article">
          </div>
          <div class="article-item-info">
              <h2>{{ article.name }}</h2>
              <p>{{ article.description}}</p>
              <span class="article-item-author">
                  <strong>Author: </strong>{{ article.author }}
              </span>
          </div>
      </router-link>
  </div>
</template>

<script>
export default {
    name: 'ArticleItem',
    props: ['article']
}
</script>

<style>
    .article-item {
        border-radius: 8px;
        margin-bottom: 20px;
        padding: 20px;
        background-color: #fff;
        box-shadow: 0px 1px 5px rgba(0, 0, 0, 0.15);
        border: 1 solid rgba(0, 0, 0, 0.2);
    }

    .article-item a {
        text-decoration: none;
        display: flex;
        align-items: flex-start;
        color: #000;
    }

    .article-item-info h2 {
        font-size: 1.7rem;
    }

    .article-item-img {
        padding-right: 20px;
        margin-right: 20px;
        border-right: 1px solid #aaa;
    }

    .article-item-img img {
        border-radius: 5px;
    }

    .article-item-info {
        display: flex;
        flex-direction: column;
        align-self: stretch;
    }

    .article-item-info p {
        flex: 1;
        color: #555;
        font-size: 1.1rem;
    }
</style>