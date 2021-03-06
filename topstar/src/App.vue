<template>
<div id='app' style="display: grid; grid-template-columns: 330px 1fr;">
  .
  <div class='bg-gray-100 border-b-2 p-2' style='position: fixed; top: 0px;'>
    <h1 class='font-extrabold text-2xl text-center'>{{ title }}</h1>
    <div class='font-normal text-xl text-center text-gray-700'>{{ subtitle }}</div>
    <h2 class='text-center font-mono text-lg mt-4'>
      <div class='text-green-700'>
        From <input type='date' v-model='startDate' @change='fetchRepositoryItems(true)' />
      </div>
      <div class='ml-4 text-red-700'>
        To <input type='date' v-model='endDate' @change='fetchRepositoryItems(true)' />
      </div>
    </h2>
    <div class='mt-1 flex items-center'>
      <span class='w-2/3'>
        <input placeholder='Search Term' class='p-1 border w-full' type='text' v-model='name' @keypress.enter='fetchRepositoryItems(true)' />
      </span>
      <span class='ml-2'>
        <input type='checkbox' v-model='includeReadme' @change="fetchRepositoryItems(true)" /> Readme
      </span>
    </div>
    <div class='mt-2'>
      <input placeholder='Language' class='p-1 border w-1/2' type='text' v-model='lang' @keypress.enter='fetchRepositoryItems(true)' />
    </div>
    <div class='mt-2 text-left' style='display: flex; flex-direction: column; justify-content: space-between; padding: 0.3rem;'>
      <h3>Sort By </h3>
      <span><input id='star' type='radio' value='stars' v-model='sort' @change="fetchRepositoryItems(true)" /> <label for='star'>Stars</label></span>
      <span><input id='fork' type='radio' value='forks' v-model='sort' @change="fetchRepositoryItems(true)" /> <label for='fork'>Forks</label></span>
      <span><input id='update' type='radio' value='updated' v-model='sort' @change="fetchRepositoryItems(true)" /><label for='update'> Update</label></span>
      <span><input id='reaction' type='radio' value='reactions' v-model='sort' @change="fetchRepositoryItems(true)" /><label for='reaction'> Reaction</label></span>
      <span><input id='interaction' type='radio' value='interactions' v-model='sort' @change="fetchRepositoryItems(true)" /><label for='interaction'> Interactions</label></span>
    </div>
    <h2 class='text-xs text-center mb-1 mt-2 w-full'>Showing 
      <span class='font-semibold text-xs'>{{ repos.length }}</span> of <span class='font-semibold text-xs'>{{ total }}</span>
    </h2>
  </div>

  <div v-if='repos.length === 0 && !fetching'
    class='text-red-600 bg-red-100 font-mono font-bold text-xl'
    style='display: grid; place-items: center; height: 33vh;'>
    <h1>NO RESULT !</h1>
  </div>

  <div id="result" class='container lg:w-full mx-auto px-6 py-4' >
    <div v-for="repo, index in repos"
         :key='repo.id'
         class='border-2 border-gray-300 rounded-lg shadow-md p-4 mb-6 bg-gray-100 hover:border-gray-700'
    >
      <div class='absolute -mt-8 -mx-8 text-white text-center w-8 h-8 py-1 rounded-full bg-blue-500'>
        {{ index + 1 }}
      </div>

      <!-- Heading -->
      <div class='flex flex-col sm:flex-row justify-between mb-1'>
        <div class='font-mono font-extrabold text-lg'>
          <a :href="repo.html_url" target="_blank">{{ repo.name }}</a>
        </div>
        <div class='flex sm:justify-between'>
          <div>
            <span class='text-yellow-500' title='Stars'>&#9733;</span>
            <span class='font-mono font-extrabold text-yellow-700 px-1'>{{ repo.stargazers_count }}</span>
          </div>
          <div>
            <span class='font-bold text-blue-500' title='Forks'>&#5788;</span>
            <span class='font-mono font-extrabold text-blue-700 ml-1'>{{ repo.forks_count }}</span>
          </div>
        </div>
      </div>

      <!-- Description -->
      <p class='text-lg text-gray-600 tracking-wider mb-2 leading-tight'>
        {{ repo.description || '–' }} 
      </p>

      <!-- Footer -->
      <div class='flex justify-between'>
        <div class='bg-gray-300 rounded-lg px-2 text-gray-600'>
          #{{ repo.language }}
        </div>
        <p class='bg-purple-200 rounded-lg px-2 text-purple-500'>
          <span title='created'>&#128336;</span>
          {{ convertDateObjectToString(new Date(repo.created_at)) }}
        </p>
      </div>
    </div>

    <!-- Infinish loading text -->
    <div v-show='incomplete_result'
         class='text-center bg-green-200 rounded-full font-bold text-green-700'>LOADING ...</div>

  </div>
</div>
</template>


<script>
import HelloWorld from './components/HelloWorld.vue'
import mockdata from './mock_data'


// Constants -----------------------------------------
const THIRTY_DAY_IN_MILISEC = 30 * 24 * 60 * 60 * 1000;
// ----------------------------------------------------


// Utils ---------------------------------------------
const convertDateObjectToString = (dateObject) => {
  // return String YYYY-MM-DD format
  let month = dateObject.getMonth() + 1;
  let date = dateObject.getDate();

  if (month < 10) month = '0' + month
  if (date < 10) date = '0' + date

  return `${dateObject.getFullYear()}-${month}-${date}`
}
// ----------------------------------------------------


// Main -----------------------------------------------
export default {
  name: 'app',
  data () {
    return {
      baseAPI: 'https://api.github.com/search/repositories',  // base search api
      title: "Github Top Star!",  // heading line
      subtitle: "The popular repositories on Github",  // heading line
      startDate: (new Date(new Date().getTime() - THIRTY_DAY_IN_MILISEC)).toISOString().split('T')[0],
      endDate: new Date().toISOString().split('T')[0],              // end date object
      startDateString: null,      // start date string for filter options
      endDateString: null,        // end date string for filter options
      repos: [],                  // simple result repository store object
      total: 0,   // total repos
      incomplete_result: true,  // can fetch more repo
      fetching: null,  // xhttp fetching state
      page: 1,  // page filter github options
      per_page: 10,  // per page filter github options
      lang: '',
      name: '',
      sort: 'stars',
      includeReadme: false,
    }
  },
  computed: {
    githubSearchURI () {
      let q = ''
      if (this.name) { 
        q += `${this.name} in:name,description`;
        if (this.includeReadme) q += ',readme'
      }
      q += ` created:${this.startDate}..${this.endDate}`;
      if (this.lang) q += ` language:${this.lang}`;
      if (this.sort) q += ` sort:${this.sort}`;

      const url = `${this.baseAPI}?q=${q}&page=${this.page}&per_page=${this.per_page}`;
      console.log('fetch', url)
      return url;
    }
  },
  components: { },
  methods: {
    convertDateObjectToString,
    handleScroll (ev) {

      // get the height of the entire document
      const height = document.documentElement.offsetHeight;
      // Get the current offset - how far "scrolled down"
      const offset = document.documentElement.scrollTop + window.innerHeight;
      const isScrollBarAtTheBottomOfThePage = height === offset

      // ensure the scroll lays at the bottom of the page
      // and still can get more repositories
      // and the last repository xhttp request is finished.
      if (isScrollBarAtTheBottomOfThePage &&
          this.incomplete_result &&
          !this.fetching) {

        // use timeout for smoothly fetching more items
        this.fetching = setTimeout(() => {
          this.fetchRepositoryItems()
        }, 200);
      }

      return false;
    },
    fetchRepositoryItems (isClear) {
      if(!this.startDate || !this.endDate) return false;

      // keep this context in self to differentiat with `this`
      // when xhttp request success callback functoin
      let self = this;

      if (isClear) {
        self.repos = []
        self.page = 1
      }

      // create simple xhttp request object
      const xhttp = new XMLHttpRequest();

      // the request callback
      xhttp.onreadystatechange = function() {

        // when request success
        if (this.readyState == 4 && this.status == 200) {
            // convert reponse result to json
            // example result please see mock_data.js file
            let result = JSON.parse(this.responseText);

            // append newly fetched repos to the collection
            if (result.items.length > 0) {
              self.repos.splice(self.repos.length, 0, ...result.items);
              // update total items
              self.total = result.total_count;
              // update whether more items to be fetched
              self.incomplete_result = !result.incomplete_result;

              // update next page for request next round
              self.page += 1

              // reset fetching state to allow infinite scroll loading more items
              self.fetching = null;
            } else {
              // no more result
              self.fetching = null;
              self.incomplete_result = false;
            }
        }
      }

      // making a request to github
      xhttp.open('GET', this.githubSearchURI, true);
      xhttp.setRequestHeader("Content-Type", "application/json");
      xhttp.send();
    },
  },
  created () {
    // initialize github filter options start and end date

    // Uncomment for use mock data than actually making xhttp request
    /*
      let result = mockdata;
      self.repos = result.items;
      self.total = result.total_count;
      self.incomplete_result = result.incomplete_result;
    */

    // fetch first page repository from github
    this.fetchRepositoryItems()

    // add event scroll for infinite scroll on window object
    window.addEventListener('scroll', this.handleScroll);
  },
  destroyed () {
    // remove scroll event from window
    // it prevents multiple trigger when in dev (hot-reload)
    window.removeEventListener('scroll', this.handleScroll);
  },
}
</script>

<style>
</style>

<style src="./assets/tailwind.css">
